from django.db import models
from django.contrib.auth.models import User
from storages.backends.s3boto3 import S3Boto3Storage
import uuid
import hashlib
import os
from django.utils.text import slugify
from django.conf import settings
from urllib.parse import urljoin, urlparse, urlunparse



class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
    
def upload_to(instance, filename):
    base, extension = os.path.splitext(filename)
    new_filename = f"{slugify(instance.title)}{extension}"
    return os.path.join('pdfs/', new_filename)

def upload_tracking_mail_receipt(instance, filename):
    base, extension = os.path.splitext(filename)
    new_filename = f"{slugify(instance.title)}-tracking-mail-receipt{extension}"
    return os.path.join('tracking_mail_receipt_aws/', new_filename)

def upload_return_receipt(instance, filename):
    base, extension = os.path.splitext(filename)
    new_filename = f"{slugify(instance.title)}-return-receipt{extension}"
    return os.path.join('return_receipts/', new_filename)

class Record(models.Model):
    RECORD_TYPE_CHOICES = [
        ('cafv', 'Conditional-Acceptance-for-Value'),
        ('ipn', 'International-Promissory-Note'),
        ('boe', 'International-Bill-of-Exchange'),
        ('noticeBreach', 'Notice-of-Breach'),
        ('noticeCure', 'Notice-of-Cure'),
        ('noticeDefault', 'Notice-of-Default'),
        ('tort', 'Tort-Claim'),
        ('noticeDemand', 'Notice-of-Demand'),
        ('noticeDispute', 'Notice-of-Dispute'),
        ('noticeFraud', 'Notice-of-Fraud'),
        ('executor', 'Executor-Letter'),
        ('crn', 'Copyright-Notice'),
        ('noticeLien', 'Notice-of-Lien'),
    ]

    TRACKING_TYPE_CHOICES = [
        ('certifiedmail_usps', 'Certified-Mail-USPS'),
        ('registeredmail_usps', 'Registered-Mail-USPS'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('delivered', 'Delivered'),
        ('confirmation', 'Confirmation'),
    ]

    title = models.CharField(max_length=255, editable=False, verbose_name="Title")
    record_type = models.CharField(max_length=20, choices=RECORD_TYPE_CHOICES, default='default', verbose_name="Record Type")
    tracking_number = models.CharField(max_length=100, blank=True, null=True, verbose_name="Tracking Number")
    tracking_type = models.CharField(max_length=20, choices=TRACKING_TYPE_CHOICES, blank=True, null=True, verbose_name="Tracking Type")
    return_receipt = models.CharField(max_length=100, blank=True, null=True, verbose_name="Return Receipt")
    #blockchain_record = models.JSONField(default=list, verbose_name="Blockchain Record")  # Start with an empty list, can be extended later
    #record_location = models.JSONField(default=list, verbose_name="Record Location")  # Array of objects for cloud bucket locations, local storage reference, etc.
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name="UUID")
    related_documents = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='related_records', verbose_name="Related Documents")
    company_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Company Name")
    ceo = models.CharField(max_length=255, blank=True, null=True, verbose_name="CEO")
    cfo = models.CharField(max_length=255, blank=True, null=True, verbose_name="CFO")
    mailing_address = models.CharField(max_length=255, blank=True, null=True, verbose_name="Mailing Address")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="City")
    state = models.CharField(max_length=100, blank=True, null=True, verbose_name="State")
    zip = models.CharField(max_length=20, blank=True, null=True, verbose_name="ZIP Code")
    email = models.EmailField(max_length=255, blank=True, null=True, verbose_name="Email")
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="Phone Number")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_records', verbose_name="Created By")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")  # Timestamp for when the record is created
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")  # Timestamp for when the record is last updated
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Status")
    is_deleted = models.BooleanField(default=False, verbose_name="Is Deleted")  # Soft delete flag
    pdf_file_aws = models.FileField(storage=S3Boto3Storage(bucket_name='omnistance-openrecord-pdfs'), upload_to=upload_to, blank=True, null=True, verbose_name="PDF File")
    tracking_mail_receipt_aws = models.FileField(storage=S3Boto3Storage(bucket_name='omnistance-openrecord-tracking'), upload_to=upload_tracking_mail_receipt, blank=True, null=True, verbose_name="Tracking Mail Receipt")
    return_receipt_file_aws = models.FileField(storage=S3Boto3Storage(bucket_name='omnistance-openrecord-greencards'), upload_to=upload_return_receipt, blank=True, null=True, verbose_name="Return Receipt File")
    hash = models.CharField(max_length=64, blank=True, null=True, editable=False, verbose_name="SHA256")
    access_logs = models.JSONField(default=list, verbose_name="Access Logs")  # Array of objects for access logs
    

    def generate_hash(self, file):
        hasher = hashlib.sha256()
        for chunk in file.chunks():
            hasher.update(chunk)
        return hasher.hexdigest()


    def save(self, *args, **kwargs):
        # Generate the title
        self.title = f"{self.get_record_type_display()}_{self.tracking_number or 'No Tracking Number'}_{self.company_name or 'No Company Name'}"

        # Generate the hash if a PDF file is uploaded
        if self.pdf_file_aws:
            self.hash = self.generate_hash(self.pdf_file_aws)
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the S3 file if it exists
        if self.pdf_file_aws:
            self.pdf_file_aws.delete(save=False)
        if self.tracking_mail_receipt_aws:
            self.tracking_mail_receipt_aws.delete(save=False)
        if self.return_receipt_file_aws:
            self.return_receipt_file_aws.delete(save=False)
        
        super().delete(*args, **kwargs)
    


    def __str__(self):
        return self.title
