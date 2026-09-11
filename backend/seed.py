from app import app
from database import db
from models import Admin, Worker


def seed_database():
    with app.app_context():

        # Create all database tables
        db.create_all()

        # =========================
        # ADMINS
        # =========================

        admins = [
            {
                "id": "A001",
                "name": "EEE Head",
                "designation": "EEE Head",
                "password": "admin123"
            },
            {
                "id": "A002",
                "name": "UGD Head",
                "designation": "UGD Head",
                "password": "admin123"
            },
            {
                "id": "DC01",
                "name": "Head",
                "designation": "Head",
                "password": "dc123"
            }
        ]

        for a in admins:
            existing_admin = Admin.query.filter_by(
                id=a["id"]
            ).first()

            if not existing_admin:
                admin = Admin(
                    id=a["id"],
                    name=a["name"],
                    designation=a["designation"],
                    password=a["password"]
                )

                db.session.add(admin)

        # =========================
        # WORKERS
        # =========================

        workers = [
            {
                "workerid": "W001",
                "department": "EEE",
                "rating": 4.5,
                "password": "worker123"
            },
            {
                "workerid": "W002",
                "department": "EEE",
                "rating": 4.2,
                "password": "worker123"
            },
            {
                "workerid": "W003",
                "department": "UGD",
                "rating": 4.6,
                "password": "worker123"
            },
            {
                "workerid": "W004",
                "department": "UGD",
                "rating": 4.1,
                "password": "worker123"
            }
        ]

        for w in workers:
            existing_worker = Worker.query.filter_by(
                workerid=w["workerid"]
            ).first()

            if not existing_worker:
                worker = Worker(
                    workerid=w["workerid"],
                    department=w["department"],
                    rating=w["rating"],
                    status="Available",
                    active_works=0,
                    password=w["password"]
                )

                db.session.add(worker)

        # Save changes
        db.session.commit()

        print("Database seeded successfully.")
        print("\nAdmin credentials:")
        print("EEE Admin -> A001 / admin123")
        print("UGD Admin -> A002 / admin123")
        print("DC Admin -> DC01 / dc123")

        print("\nWorker credentials:")
        print("EEE Worker -> W001 / worker123")
        print("EEE Worker -> W002 / worker123")
        print("UGD Worker -> W003 / worker123")
        print("UGD Worker -> W004 / worker123")


if __name__ == "__main__":
    seed_database()