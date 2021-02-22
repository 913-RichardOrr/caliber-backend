/******************************************************
   Create Tables
******************************************************/

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
	overallStatus STATUS,
	batchId int
);

-- join  table
create table weekCategories
(
	categoryId int,
	qcWeekId int,
	primary key(categoryId, qcWeekId)
);

create type STATUS as enum ('Undefined', 'Poor', 'Good', 'Superstar');

create table qcNotes
(
	qcNoteId serial primary key,
	weekNumber int,
	batchId text, 
	associateId int,
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
