# Local Mysql

```bash
docker run --name dolang-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=dolang -e MYSQL_USER=user -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql:8.0.40
```

```bash
docker stop dolang-mysql &&
docker rm dolang-mysql
```