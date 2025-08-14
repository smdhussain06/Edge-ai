import json
from backend.app import app

def run():
    client = app.test_client()
    # Get storage info
    r = client.get('/api/storage')
    print('GET /api/storage', r.status_code, r.is_json)
    data = r.get_json()
    print('save_dir =', data.get('save_dir'))

    # Save a tiny chat
    sample = [{'role':'user','content':'hi'},{'role':'assistant','content':'hello'}]
    r2 = client.post('/api/storage/save', json={'name':'_smoke_test_', 'content': sample})
    print('POST /api/storage/save', r2.status_code)
    print(r2.get_json())

    # Read it back
    r3 = client.post('/api/storage/read', json={'name':'_smoke_test_.json'})
    print('POST /api/storage/read', r3.status_code)
    print(r3.get_json())

if __name__ == '__main__':
    run()
