import { AuthAPIService } from '../../auth/auth.service';
import { Component, OnInit, Input, OnDestroy, Query, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OperationsService } from '../../shared/application-services/operations.service';
import { CommentService } from '../../shared/application-services/comment.service';
import { QueryResponse } from '../../shared/interfaces/query-response';
import { Batch } from '../../shared/interfaces/batch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmitIfValidDirective } from '../../shared/directives/submit-if-valid.directive';
import { NgForm, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from '../../shared/validators/customValidation';
import { CalendarModule } from 'primeng/calendar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BatchReworkComponent } from '../batch-rework/batch-rework.component';


@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})

export class OperationsComponent implements OnInit, OnDestroy {

  @ViewChild(BatchReworkComponent) batchReworkComponent: BatchReworkComponent

  private productionObservable: Observable<any>;
  private productionSub: any;
  prodStats: {};

  private floorstockItemsSub: any;
  floorstockItems: {};

  floorstockChanges: {};

  //private prodStats: JSON[];
  private comments: JSON[];

  // SCOREBOARD SECTION

  prodDisplay: any = [];
  prodDataAdded = false;
  prodDataError = false;
  dateErrorMsg: String;

  // Variables for getting todays date
  private todaysDate: any;
  private currentTime: any;


  prodDataColumns = ['Time stamp', 'Staff', 'Produced', 'Signature']

  // END SCOREBOARD SECTION  

  // Latest batch
  latestBatchSub: any;
  latestBatch: Batch;

  //Rework
  private modal: NgbModalRef

  reworking: boolean;
  reworkForm: FormGroup;
  reworkSuccess: boolean;
  updateError: any;
  updateErrorKeys: any;

  // FLOORSTOCK SECTION

  myFocusVar: boolean = false;

  floorstockErrorMsg;
  floorstockDataError;
  floorstockAdded = false;
  buttonOn = false;

  private productLabelPairs: any[] = [
    { article_number: '700-5208', label: 'Groninger Label 301-6914' },
    { article_number: '700-5194', label: 'Groninger Label 301-6915' },
    { article_number: '700-5196', label: 'Groninger Label 301-7905' },
    { article_number: '700-5197', label: 'Groninger Label 301-8023' },
    { article_number: '700-5280', label: 'Groninger Label 301-8025' },
    { article_number: '700-5288', label: 'Groninger Label 301-8025' },
  ]

  currentFloorstock: any[] = [];
  beforeChanges: any[] = [];
  ngModelFloorstock: any[] = [];

  // END FLOORSTOCK SECTION


  // COMMENT SECTION
  private commentsSub: any;
  commentForm: FormGroup;
  // Variables for add comment used html
  commentAdded = false;
  commentError = false;

  // Variables for creating a new comment. 
  private commentDate: Date;
  private commentId: Number;
  private commentName: any;
  private commentText: any;
  private req_comment: any;

  // END COMMENT SECTION

  //the following items are copied from start-batch.component
  private prodActive: boolean;
  prodInfo: any;
  private service_prodInfo: any;

  productionForm: FormGroup;

  disableInput = true;

  constructor(
    private operationsService: OperationsService,
    private commentService: CommentService,
    private http: HttpClient, private authAPI: AuthAPIService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.productionForm = this.formBuilder.group({
      'inputDate': new FormControl('', [
        Validators.required
      ]),
      'onShift': new FormControl('', [
        Validators.required
      ]),
      'produced': new FormControl('', [
        Validators.required
      ]),
      'signature': new FormControl('', [
        Validators.required,
        Validators.pattern("^[A-Öa-ö]*$"),
        Validators.minLength(2),
      ]),
    })

    this.commentForm = this.formBuilder.group({
      'commentName': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("^[A-Öa-ö]*$")
      ]),
      'commentText': new FormControl('', [
        Validators.required,
      ])
    })

    this.service_prodInfo = this.operationsService.$prodInfo.subscribe(info => {
      this.prodInfo = info
      if (this.prodInfo) {
        this.getProdList()
        this.getFloorstock()
        this.getComment()
      } else {
        this.getLastBatch()
      }
    })
  }

  getLastBatch() {
    this.latestBatchSub = this.operationsService.getBatch("?limit=1")
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe(data => {
        this.latestBatch = (data as QueryResponse).results[0]
      })
  }

  getFloorstock() {
    this.floorstockItemsSub = this.operationsService.getFloorstockItems()
      .switchMap(data => {
        this.floorstockItems = (data as QueryResponse).results
        return this.operationsService.getFloorstockChanges('?batch_number=' + this.prodInfo.batch_number)
      })
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe(data => {
        this.floorstockChanges = (data as QueryResponse).results

        let correctLabel;

        for (let key in this.productLabelPairs) {
          if (this.productLabelPairs[key].article_number == this.prodInfo.order.article_number) {
            correctLabel = this.productLabelPairs[key].label
          }
        }
        this.currentFloorstock = [];
        for (let key in this.floorstockItems) {
          if (
            this.floorstockItems[key]["item_name"] == correctLabel ||
            this.floorstockItems[key]["item_name"] == "Zebra Label" ||
            this.floorstockItems[key]["item_name"] == "Scale Roll" ||
            this.floorstockItems[key]["item_name"] == "Pester 301-6908" ||
            this.floorstockItems[key]["item_name"] == "Pester 301-6907" ||
            this.floorstockItems[key]["item_name"] == "Sleever 301-6906" ||
            this.floorstockItems[key]["item_name"] == "Groninger Carbon 001-1995"
          ) {
            let item = { item_name: this.floorstockItems[key]["item_name"] }
            item["item_id"] = this.floorstockItems[key]["item_id"]
            this.currentFloorstock.push(item)
          }
        }
        for (let k in this.floorstockChanges) {
          for (let obj = 0; obj < this.currentFloorstock.length; obj++) {
            if (this.currentFloorstock[obj]["item_id"] == this.floorstockChanges[k]["floorstock_item"]) {
              this.currentFloorstock[obj]["id"] = this.floorstockChanges[k]["id"]
              this.currentFloorstock[obj]["quantity"] = this.floorstockChanges[k]["quantity"]
              this.currentFloorstock[obj]["last_update"] = this.floorstockChanges[k]["time_stamp"]
              this.currentFloorstock[obj]["batch"] = this.floorstockChanges[k]["batch"]
            }
          }
        }
        for (let obj = 0; obj < this.currentFloorstock.length; obj++) {
          if (typeof this.currentFloorstock[obj]["quantity"] == 'undefined') {
            this.currentFloorstock[obj]["id"] = null
            this.currentFloorstock[obj]["quantity"] = null
            this.currentFloorstock[obj]["last_update"] = null
            this.currentFloorstock[obj]["batch"] = ''
          }
        }
        this.beforeChanges = JSON.parse(JSON.stringify(this.currentFloorstock))
      });
  }

  addOne(item_id, quantity, change) {
    this.buttonOn = true
    if (change == 'incr') {
      for (let obj = 0; obj < this.currentFloorstock.length; obj++) {
        if (this.currentFloorstock[obj]["item_id"] == item_id) {
          this.currentFloorstock[obj]["quantity"] += 1
        }
      }
    }
    else if (change == 'decr') {
      for (let obj = 0; obj < this.currentFloorstock.length; obj++) {
        if (this.currentFloorstock[obj]["item_id"] == item_id && this.currentFloorstock[obj]["quantity"] > 0) {
          this.currentFloorstock[obj]["quantity"] -= 1
        }
      }
    }
  }

  getComment() {
    this.commentsSub = this.commentService.getComment()
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe(data => {
        this.comments = data as JSON[]
      });
  }

  getProdList() {
    this.productionObservable = this.operationsService.getProdStats('?batch_number=' + this.prodInfo.batch_number + '&limit=96')
    this.productionSub = this.productionObservable
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe(data => {
        this.prodStats = (data as QueryResponse).results
        for (let obj in this.prodStats) {
          this.prodDisplay.push(this.prodStats[obj])
        }
      });
  }

  submitProduction(event, formData) {
    this.dateErrorMsg = null
    this.prodDataError = false
    let inputData: any = {};

    // Collects all changes and stores as dictionary in the object results
    for (let key in formData.value) {
      inputData[key] = formData.value[key];
    }
    for (let key in this.prodDisplay) {
      if (
        inputData.inputDate.getFullYear() == new Date(this.prodDisplay[key].time_stamp).getFullYear() &&
        inputData.inputDate.getMonth() == new Date(this.prodDisplay[key].time_stamp).getMonth() &&
        inputData.inputDate.getDate() == new Date(this.prodDisplay[key].time_stamp).getDate() &&
        inputData.inputDate.getHours() == new Date(this.prodDisplay[key].time_stamp).getHours() &&
        inputData.inputDate.getMinutes() == new Date(this.prodDisplay[key].time_stamp).getMinutes()
      ) {
        this.prodDataError = true
      }
    }
    if (this.prodDataError == false) {
      let newData = {
        time_stamp: inputData.inputDate,
        production_quantity: inputData.produced,
        staff_quantity: inputData.onShift,
        user_name: inputData.signature,
        batch: this.prodInfo.id,
      }
      this.operationsService.createProdStats(newData)
        .retryWhen(error => this.authAPI.checkHttpRetry(error))
        .subscribe(data => {
          this.prodDataAdded = true
          setTimeout(() => { this.prodDataAdded = false }, 4000);
          formData.reset()
          this.prodDisplay.unshift(data)
          this.prodDisplay.sort(function compare(a, b) {
            var dateA = new Date(a.time_stamp);
            var dateB = new Date(b.time_stamp);
            return (dateB.getTime() - dateA.getTime())
          });
        });

    }
    else if (this.prodDataError) {
      this.dateErrorMsg = '* Production data with this time stamp already exists'
    }
  }

  updateFloorstock(event, inputData) {
    let results: any = {};

    // Collects all changes and stores as dictionary in the object results
    for (let key in inputData.value) {
      if (typeof inputData.value[key] == 'number') {
        results[key] = inputData.value[key];
      }
    }
    for (let key in results) {
      let counter = 0;
      for (let obj = 0; obj < this.beforeChanges.length; obj++) {
        // Checks if time stamp exists. Determines wheter data should be created or updated

        if (this.beforeChanges[obj]["item_id"] == key && this.beforeChanges[obj]["quantity"] != results[key] && this.beforeChanges[obj]["quantity"] != null) {
          let updateItem = {
            id: this.beforeChanges[obj].id,
            time_stamp: new Date(),
            quantity: results[key],
            floorstock_item: key,
            batch: this.prodInfo.id,
          }
          this.operationsService.updateFloorstock(updateItem)
            .retryWhen(error => this.authAPI.checkHttpRetry(error))
            .subscribe();
          this.floorstockAdded = true
          setTimeout(() => { this.floorstockAdded = false }, 4000);
        }

        else if (this.beforeChanges[obj]["item_id"] == key && this.beforeChanges[obj]["quantity"] != results[key] && this.beforeChanges[obj]["quantity"] == null) {
          // If no time stamp in api was found this means it is new data
          let createItem = {
            time_stamp: new Date(),
            quantity: results[key],
            floorstock_item: key,
            batch: this.prodInfo.id,
          }
          this.operationsService.createFloorstock(createItem)
            .retryWhen(error => this.authAPI.checkHttpRetry(error))
            .subscribe(data => {
              let newData = data
              this.getFloorstock()
              this.floorstockAdded = true
              setTimeout(() => { this.floorstockAdded = false }, 4000);
            },
              error => {
                if (error) {
                  this.floorstockErrorMsg = error.error
                  this.floorstockDataError = true
                  this.prodDataAdded = false
                }
              });
        }
        else if (this.beforeChanges[obj]["item_id"] == key) {
          break;
        }
      }
    }
    this.buttonOn = false;
  }

  submitComment(event, formData) {
    this.commentName = formData.value['commentName'];
    this.commentText = formData.value['commentText'];
    this.commentDate = new Date();

    let newComment = {
      comment_id: this.comments["results"].length,
      user_name: this.commentName,
      post_date: this.commentDate,
      text_comment: this.commentText,
      batch: this.prodInfo.id,
    }
    // Add new comment through commentService. Also get all comments in api to be able to count for incrementing id next comment
    this.req_comment = this.commentService.addComment(newComment)
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe(data => {
        this.getComment()
        this.commentError = false
        this.commentAdded = true
        setTimeout(() => { this.commentAdded = false }, 4000);
      },
        error => {
          if (error) {
            this.commentAdded = false
            this.commentError = true
          }
        });
    // Resets form
    formData.reset()
  }

  setRework(state: boolean) {
    if (state == true) {
      this.reworkForm = this.formBuilder.group({
      })
      this.reworking = true
    } else {
      this.reworking = false
    }
  }

  openModal(content) {
    this.modal = this.modalService.open(content, { size: 'lg' });
  }

  handleUpdateError(error) {
    console.error(error)
    this.updateError = error.error;
    this.updateErrorKeys = [];
    for (let i = 0; i < Object.keys(error.error).length; i++) {
      this.updateErrorKeys.push(Object.keys(error.error)[i])
    }
  }

  clearMsg() {
    this.reworkSuccess = null;
    this.updateError = null;
    this.updateErrorKeys = null;
  }

  submitRework($event, reworkForm) {
    let _label_print_time = new Date()
    let _applied_labels = this.batchReworkComponent.getAppliedLabels()
    let _pick_and_replace = this.batchReworkComponent.getPickAndReplace(this.latestBatch, _applied_labels, this.latestBatch.scrap)

    let batch: Batch = {
      id: this.latestBatch.id,
      batch_number: this.latestBatch.batch_number,
      is_active: 0,
      order: this.latestBatch.order,
      applied_labels: _applied_labels,
      rework_date: new Date(),
    }
    if (this.modal) {
      this.modal.close()
    }
    this.setRework(false)
    this.clearMsg()
    this.operationsService.updateBatch(batch)
      .retryWhen(error => this.authAPI.checkHttpRetry(error))
      .subscribe((data: Batch) => {
        this.latestBatch = data
        this.reworkSuccess = true

      },
        error => {
          this.reworkSuccess = false
          this.handleUpdateError(error)
        }
      )
  }

  ngOnDestroy() {
    if (this.latestBatchSub) {
      this.latestBatchSub.unsubscribe()
    }
    if (this.floorstockItemsSub) {
      this.floorstockItemsSub.unsubscribe()
    }
    if (this.commentsSub) {
      this.commentsSub.unsubscribe()
    }
    if (this.productionSub) {
      this.productionSub.unsubscribe()
    }
  }
}
