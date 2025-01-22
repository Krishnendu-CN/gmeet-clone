from flask import Flask
from flask_cors import CORS  # Import CORS
from video_recording import start_video_recording

app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app, origins="https://gmeet-clone-frontend-kqb9n69n8-krishnendu-pauls-projects.vercel.app")  # Allow requests from React frontend

@app.route('/start_recording', methods=['GET'])
def start_record():
    start_video_recording()
    return "Recording started", 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
