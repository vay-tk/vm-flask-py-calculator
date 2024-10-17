from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data['expression']
    
    try:
        result = str(eval(expression.replace('%', '/100')))
        history.append(f"{expression} = {result}")
        return jsonify({'result': result, 'success': True})
    except:
        return jsonify({'result': 'Error', 'success': False})

@app.route('/get_history')
def get_history():
    return jsonify(history)

@app.route('/clear_history', methods=['POST'])
def clear_history():
    history.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)