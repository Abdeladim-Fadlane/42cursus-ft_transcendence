all : build
	
git : per add commit push 
	
add : 
	git add .

commit :
	git commit -m "$(shell date +'%Y-%m-%d %H:%M')"

push :
	git push 

run :
	docker compose up

build :
	docker compose up --build

down:

	docker compose down -v 

rmv : per
	rm -rf postgreSql

restart:down run

per :
	sudo chmod -R 0777 .

clean : 
	docker compose  down 

fclean : clean
	docker system prune -a
re : fclean all