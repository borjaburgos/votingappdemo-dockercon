from flask import Flask
from flask import render_template
from flask import request
from redis import Redis, RedisError
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, password=os.environ.get('REDIS_ENV_REDIS_PASS'))

app = Flask(__name__)

redis.set("dogs", 0)
redis.set("cats", 0)
redis.set("whales", 0)

@app.route("/", methods=['POST','GET'])
def hello():
    try:
        dogs = redis.get("dogs")
        cats = redis.get("cats")
        whales = redis.get("whales")
        visits = redis.incr('counter')
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"
    if request.method == 'POST':
        if request.form['cats'] == 'Whales':
            try:
                whales = redis.incr('whales')
                redis.publish('pubsub', '{"cats":'+str(cats)+', "dogs":'+str(dogs)+', "whales":'+str(whales)+'}')
            except Exception as e:
                print e
                dogs = "<i>An error occured</i>"
            return render_template('thankyou.html', name=os.getenv('NAME', "Dogs VS Whales"))
        if request.form['cats'] == 'Cats':
            try:
                cats = redis.incr('cats')
                redis.publish('pubsub', '{"cats":'+str(cats)+', "dogs":'+str(dogs)+', "whales":'+str(whales)+'}')
            except Exception as e:
                print e
                cats = "<i>An error occured</i>"
            return render_template('thankyou.html', name=os.getenv('NAME', "Dogs VS Whales"))
        if request.form['cats'] == 'Dogs':
            try:
                dogs = redis.incr('dogs')
                redis.publish('pubsub', '{"cats":'+str(cats)+', "dogs":'+str(dogs)+', "whales":'+str(whales)+'}')
            except Exception as e:
                print e
                dogs = "<i>An error occured</i>"
            return render_template('thankyou.html', name=os.getenv('NAME', "Dogs VS Whales"))
    elif request.method == 'GET':
        return render_template('index.html', name=os.getenv('NAME', "Dogs VS Whales"), hostname=socket.gethostname(), visits=visits)


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80)
