# suggested ERD

## qc_week table
```
    id           int
    category_id  int
    batch_id     varchar
    week         int
```

* POST /batches/{batchId}/weeks 
--- add a new week if not exist

*comment: Do we also include categories on the form submit?

---------------

## qc_note table
```
    id                 int
    batch_id           varchar
    associate_id       varchar
    week               int
    technical_status   STATUS
    soft_skill_status  STATUS
    content            varchar
    type               QC_NOTE_TYPE
```

* GET /batches/{batchId}/weeks/{weekId}
  --- get all the info for the specified week

* POST /batches/{batchId}/weeks/{weekId}
  ---  add an overall note for the batch

*comment: submit an overall note for all associates for the batch at once?  Should we also need to have an update capability or an indivdual edit button for each associate from GET screen ? (Maybe not at this stage) 

---------------

## category table

  ```
    id     int
    skill  varchar
    active boolean
  ```

  * Tasks for different teams