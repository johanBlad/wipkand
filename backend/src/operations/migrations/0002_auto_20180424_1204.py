# Generated by Django 2.0.3 on 2018-04-24 10:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('operations', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='batch',
            options={'managed': False, 'ordering': ['-start_date']},
        ),
        migrations.AlterModelOptions(
            name='batchcomment',
            options={'managed': False, 'ordering': ['-post_date']},
        ),
        migrations.AlterModelOptions(
            name='productorder',
            options={'managed': False, 'ordering': ['-order_number']},
        ),
    ]
