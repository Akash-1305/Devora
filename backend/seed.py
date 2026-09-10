from app import app
from database import db
from models import Admin, Worker

ADMINS=[
    ('A001','EEE Head','EEE Head','admin123'),
    ('A002','UGD Head','UGD Head','admin123'),
    ('DC001','Deputy Commissioner','DC','dc123')
]
WORKERS=[
    ('W001','EEE',4.5,'Available',0,'worker123'),
    ('W002','EEE',4.2,'Available',0,'worker123'),
    ('W003','UGD',4.6,'Available',0,'worker123'),
    ('W004','UGD',4.1,'Available',0,'worker123')
]

with app.app_context():
    db.create_all()
    for row in ADMINS:
        if not Admin.query.get(row[0]): db.session.add(Admin(id=row[0],name=row[1],designation=row[2],password=row[3]))
    for row in WORKERS:
        if not Worker.query.get(row[0]): db.session.add(Worker(workerid=row[0],department=row[1],rating=row[2],status=row[3],active_works=row[4],password=row[5]))
    db.session.commit()
    print('JanSeva seed data ready.')
    print('Admins: A001/admin123, A002/admin123, DC001/dc123')
    print('Workers: W001-W004 / worker123')
