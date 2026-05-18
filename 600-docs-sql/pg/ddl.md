创建自增ID
```sql
CREATE TABLE student (
	-- 自增ID
	id serial NOT NULL,
	name varchar(100) NOT NULL,
	sex varchar(5) NOT NULL,
	PRIMARY KEY (id)
);
```