from django.db import models
from operations.models import *

class ProductionStatistic(models.Model):
    time_stamp = models.DateTimeField(primary_key=True)
    batch = models.ForeignKey(Batch, models.DO_NOTHING)
    production_quantity = models.IntegerField(blank=True, null=True)
    staff_quantity = models.IntegerField(blank=True, null=True)
    user_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'production_statistic'
        ordering = ['-time_stamp']

    def __str__(self):
        return str(self.time_stamp)  + ' - ' + str(self.batch)