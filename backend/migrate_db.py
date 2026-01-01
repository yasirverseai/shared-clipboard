"""
Database migration script to add last_accessed column to existing clipboards.

Run this script once to update your existing database schema.

Usage:
    python migrate_db.py
"""

import sqlite3
from datetime import datetime


def migrate():
    """Add last_accessed column to clipboards table"""

    print("=" * 60)
    print("Database Migration Script")
    print("=" * 60)
    print()

    # Connect to database
    conn = sqlite3.connect("clipboard.db")
    cursor = conn.cursor()

    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(clipboards)")
        columns = [column[1] for column in cursor.fetchall()]

        if "last_accessed" in columns:
            print("✓ Column 'last_accessed' already exists")
            print("  No migration needed!")
        else:
            print("Adding 'last_accessed' column to clipboards table...")

            # Add the column
            cursor.execute("""
                ALTER TABLE clipboards
                ADD COLUMN last_accessed DATETIME
            """)

            # Update existing clipboards with current timestamp
            current_time = datetime.utcnow().isoformat()
            cursor.execute(
                """
                UPDATE clipboards
                SET last_accessed = ?
                WHERE last_accessed IS NULL
            """,
                (current_time,),
            )

            rows_updated = cursor.rowcount

            conn.commit()

            print(f"✓ Column added successfully")
            print(f"✓ Updated {rows_updated} existing clipboard(s)")

        print()
        print("=" * 60)
        print("Migration Complete!")
        print("=" * 60)

    except Exception as e:
        print(f"✗ Migration failed: {str(e)}")
        conn.rollback()
        return False
    finally:
        conn.close()

    return True


if __name__ == "__main__":
    migrate()
