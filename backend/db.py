from pathlib import Path
import sqlite3
import time

DB_PATH = Path(__file__).resolve().parent / "no_code.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    DB_PATH.parent.mkdir(exist_ok=True)
    conn = get_conn()
    cur = conn.cursor()

    # Stores workflow execution runs (JSON is stored as TEXT)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS workflow_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workflow_id TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at INTEGER NOT NULL,
            finished_at INTEGER,
            result_json TEXT,
            log TEXT
        )
        """
    )

    # Raw widget view events
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS widget_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            widget_id TEXT NOT NULL,
            viewed_at INTEGER NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()


def now_ts() -> int:
    return int(time.time())
