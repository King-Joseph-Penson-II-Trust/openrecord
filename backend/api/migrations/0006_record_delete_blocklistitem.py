# Generated by Django 4.2.17 on 2025-01-14 13:09

import api.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import storages.backends.s3
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0005_blocklistitem_delete_blocklistentry'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(editable=False, max_length=255, verbose_name='Title')),
                ('record_type', models.CharField(choices=[('cafv', 'Conditional_Acceptance_for_Value'), ('ipn', 'International_Promissory_Note'), ('boe', 'International_Bill_of_Exchange'), ('noticeBreach', 'Notice_of_Breach'), ('noticeCure', 'Notice_of_Cure'), ('noticeDefault', 'Notice_of_Default'), ('tort', 'Tort_Claim'), ('noticeDemand', 'Notice_of_Demand'), ('noticeDispute', 'Notice_of_Dispute'), ('noticeFraud', 'Notice_of_Fraud'), ('executor', 'Executor_Letter'), ('crn', 'Copyright_Notice')], default='default', max_length=20, verbose_name='Record Type')),
                ('tracking_number', models.CharField(blank=True, max_length=100, null=True, verbose_name='Tracking Number')),
                ('tracking_type', models.CharField(blank=True, choices=[('certifiedmail_usps', 'Certified Mail USPS'), ('registeredmail_usps', 'Registered Mail USPS')], max_length=20, null=True, verbose_name='Tracking Type')),
                ('return_receipt', models.CharField(blank=True, max_length=100, null=True, verbose_name='Return Receipt')),
                ('blockchain_record', models.JSONField(default=list, verbose_name='Blockchain Record')),
                ('record_location', models.JSONField(default=list, verbose_name='Record Location')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='UUID')),
                ('company_name', models.CharField(blank=True, max_length=255, null=True, verbose_name='Company Name')),
                ('ceo', models.CharField(blank=True, max_length=255, null=True, verbose_name='CEO')),
                ('cfo', models.CharField(blank=True, max_length=255, null=True, verbose_name='CFO')),
                ('mailing_address', models.CharField(blank=True, max_length=255, null=True, verbose_name='Mailing Address')),
                ('city', models.CharField(blank=True, max_length=100, null=True, verbose_name='City')),
                ('state', models.CharField(blank=True, max_length=100, null=True, verbose_name='State')),
                ('zip', models.CharField(blank=True, max_length=20, null=True, verbose_name='ZIP Code')),
                ('email', models.EmailField(blank=True, max_length=255, null=True, verbose_name='Email')),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True, verbose_name='Phone Number')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('delivered', 'Delivered'), ('confirmation', 'Confirmation')], default='pending', max_length=20, verbose_name='Status')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='Is Deleted')),
                ('pdf_file', models.FileField(blank=True, null=True, storage=storages.backends.s3.S3Storage(bucket_name='omnistance-openrecord-pdfs'), upload_to=api.models.upload_to, verbose_name='PDF File')),
                ('tracking_mail_receipt', models.FileField(blank=True, null=True, storage=storages.backends.s3.S3Storage(bucket_name='omnistance-openrecord-tracking'), upload_to=api.models.upload_tracking_mail_receipt, verbose_name='Tracking Mail Receipt')),
                ('return_receipt_file', models.FileField(blank=True, null=True, storage=storages.backends.s3.S3Storage(bucket_name='omnistance-openrecord-greencards'), upload_to=api.models.upload_return_receipt, verbose_name='Return Receipt File')),
                ('hash', models.CharField(blank=True, max_length=64, null=True, verbose_name='SHA256')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_records', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('related_documents', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='related_records', to='api.record', verbose_name='Related Documents')),
            ],
        ),
        migrations.DeleteModel(
            name='BlocklistItem',
        ),
    ]
