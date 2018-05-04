import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// Application imports
import { AuthAPIService } from '../../auth/auth.service';
import { OperationsService } from '../shared/services/operations.service';
import { QueryResponse } from '../../shared/interfaces/query-response';
import { Batch } from '../../shared/interfaces/batch';

@Component({
  selector: 'app-start-batch',
  templateUrl: './start-batch.component.html',
  styleUrls: ['./start-batch.component.css']
})

export class StartBatchComponent implements OnInit, OnDestroy {
  private prodActive: boolean;
  private prodInfo: {};
  private batch: string;
  private order: string;
  private article: string;
  private batchStartDate: Date;

  private req_batch: any;
  private req_order: any;
  private service_prodStatus: any;
  private service_prodInfo: any;

  //What is this below?
  newBatch: number;

  title = "Start new batch";
  prodData: any[];

  readonly ROOT_URL = 'http://localhost:8000/api/operations/product/'

  @Input()
  passedQuery: number;
  constructor(
    private router: Router,
    private operationsService: OperationsService,
    private http: HttpClient,
    private authAPI: AuthAPIService
  ) { }

  ngOnInit() {
    //Use operationsService to share information between start-batch, finish-batch and current-batch-info
    //TODO: Change to one observable. Cant be good to have many observables...
    //this.service_prodStatus = this.operationsService.prodActiveObservable.subscribe(active => this.prodActive = active)
    this.service_prodInfo = this.operationsService.prodInfoObservable.subscribe(info => this.prodInfo = info)

    //TODO: There should be no HTTP calls in components. Move to service
    this.http.get(this.ROOT_URL).subscribe(data => {
      this.prodData = (data as QueryResponse).results as any[];		// FILL THE ARRAY WITH DATA.
    },
    );
    if (this.passedQuery) {
      this.newBatch = this.passedQuery
    }
  }

  //BUG? - If we unsubscribe to the service, will the info still be updated?
  ngOnDestroy() {
    //These are causing bugs with posts. How to unsubscribe from HTTP posts?
    //this.req_order.unsubscribe()
    //this.req_batch.unsubscribe()
    //this.service_prodStatus.unsubscribe()
    this.service_prodInfo.unsubscribe()
  }


  submitBatch(event, formData) {
    //TODO: Do we really need to store these values in the class? 
    this.batch = formData.value['batchnr'];
    this.order = formData.value['ordernr'];
    this.article = formData.value['prodnr'];
    this.batchStartDate = new Date();

    let newBatch = {
      batch_number: this.batch,
      order_number: {
        order_number: this.order,
        article_number: this.article,
      },
      start_date: this.batchStartDate
    }

    this.req_batch = this.operationsService.createBatch(newBatch)
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe();
    this.router.navigate(['/home'])
  }
}

