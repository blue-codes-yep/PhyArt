from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

def generate_fractal_data(size, seed=None):
    np.random.seed(seed)  # Set seed for reproducibility if provided
    x = np.linspace(-2, 2, size)
    y = np.linspace(-2, 2, size)
    X, Y = np.meshgrid(x, y)
    Z = np.cos(X) * np.sin(Y) + np.random.uniform(-0.5, 0.5, X.shape)  # Add randomness
    return X.flatten().tolist(), Y.flatten().tolist(), Z.flatten().tolist()

@app.route('/data', methods=['GET'])
def get_data():
    size = request.args.get('size', default=500, type=int)  # Allow size to be modified
    seed = request.args.get('seed', default=None, type=int)  # Allow seed to be modified
    X, Y, Z = generate_fractal_data(size, seed)
    return jsonify({'X': X, 'Y': Y, 'Z': Z})

if __name__ == '__main__':
    app.run(debug=True)
