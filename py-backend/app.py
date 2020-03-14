from flask import Flask, url_for, redirect, request, jsonify
from flask_socketio import SocketIO, emit
import redis

app = Flask(__name__)
r = redis.Redis(host='localhost', port=8081, db=0)
socketio = SocketIO(app)

@app.route('/')
def redir_frontend():
    return redirect(url_for('static', filename='simple-frontend/frontend.html'))

@app.route('/push_calc', methods=['POST'])
def push_calc():
    print(str(request.get_data()))
    new_calc = str(request.get_json()['new_calc'])
    r.lpush('calcs', new_calc) # push new calculation to the front of the list
    socketio.emit('new_calc', request.get_json()) # show new calculation to connected clients
    return jsonify(sucess=True)


@socketio.on('connect')
def send_ten():
    init_list = []
    for i in r.lrange('calcs', 0, 9):
        init_list.append(i.decode('utf-8'))  
    emit('init_list', init_list)


if __name__ == '__main__':
    socketio.run(app)
