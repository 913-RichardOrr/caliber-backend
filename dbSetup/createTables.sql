/******************************************************
	Delete Tables
******************************************************/

drop table if exists categories cascade;
drop table if exists qcWeeks cascade;
drop table if exists weekCategories cascade;
drop table if exists qcNotes cascade;

/******************************************************
	Create Tables
******************************************************/

create type STATUS as enum ('Undefined', 'Poor', 'Average', 'Good', 'Superstar');

create table categories
(
	categoryId serial primary key,
	skill text not null,
	active boolean
);

create table qcWeeks
(
	qcWeekId serial primary key,
	weekNumber int,
	note text,
	batchId int
);

-- join  table
create table weekCategories
(
	categoryId int,
	qcWeekId int,
	primary key(categoryId, qcWeekId)
);

create table qcNotes
(
	qcNoteId serial primary key,
	weekNumber int,
	batchId text, 
	associateId text,
	technicalStatus STATUS,
	noteContent text
);

/******************************************************
   Create Foreign Keys
******************************************************/
-- a category CAN HAVE MANY qcWeeks
alter table weekCategories add constraint fk_weekCategoriesCategoryId foreign key (categoryId) references categories (categoryId) on delete cascade on update cascade;

-- a qcWeek CAN HAVE MANY categories
alter table weekCategories add constraint fk_weekCategoriesqcWeekId foreign key (qcWeekId) references qcWeeks (qcWeekId) on delete cascade on update cascade;
