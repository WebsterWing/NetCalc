from flask import Flask
from flask_socketio import SocketIO
import redis

app = Flask(__name__)
r = redis.Redis(host='localhost', port=8081, db=0)
socketio = SocketIO(app)

@app.route('/')
def hello_world():
    return 'Sequence Number: ' + str(r.incr('seq-num'))


if __name__ == '__main__':
    socketio.run(app)
