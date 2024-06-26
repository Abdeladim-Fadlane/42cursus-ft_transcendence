
# x = lambda a ,b,c : 5

# print(x(5, 6, 7))


dic = {
    "age": 1,
}

dict2 = {
    "age": 2,
}

dict6 = {
    "age": 3,
}

dict3 = {"age": 4,}

dict4= {
    "age": 5,
}

dict5 = {
    "age":6,
}

list1 = [dic, dict2, dict3, dict4, dict5, dict6]

tuple1 = (dic, dict2, dict3, dict4, dict5, dict6)

set1 = {dic, dict2, dict3, dict4, dict5, dict6}


x = sorted(list1, key=lambda x: x['age'], reverse=True)

for i in  range(len(x)):
    if x[i]["age"] == 5:
        print(i+1)