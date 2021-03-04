drop table if exists categories cascade;
drop table if exists qcweeks cascade;
drop table if exists weekcategories cascade;
drop table if exists qcnotes cascade;

/******************************************************
   Create Tables
******************************************************/

create table categories
(
	categoryid serial primary key,
	skill text not null,
	active boolean
);

create type STATUS as enum ('Undefined', 'Poor', 'Average', 'Good', 'Superstar');

create table qcweeks
(
	qcweekid serial primary key,
	weeknumber int not null,
	note text,
	overallstatus STATUS,
	batchid text not null,
	unique (batchid, weeknumber)
);

-- join  table
create table weekcategories
(
	categoryid int,
	qcweekid int,
	primary key(categoryid, qcweekid)
);

create table qcnotes
(
	qcnoteid serial primary key,
	weeknumber int not null,
	batchid text not null,
	associateid text not null,
	technicalstatus STATUS,
	notecontent text,
	unique (weeknumber, batchid, associateid)
);

/******************************************************
   Create Foreign Keys
******************************************************/
-- a category CAN HAVE MANY qcWeeks
alter table weekcategories add constraint fk_weekcategoriescategoryid foreign key (categoryid) references categories (categoryid) on delete cascade on update cascade;

-- a qcWeek CAN HAVE MANY categories
alter table weekcategories add constraint fk_weekcategoriesqcweekid foreign key (qcweekid) references qcweeks (qcweekid) on delete cascade on update cascade;
