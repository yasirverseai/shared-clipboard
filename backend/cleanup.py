"""
Automated cleanup script for Shared Clipboard.

This script can be run as a cron job or scheduled task to automatically
clean up old and unused clipboards to free up database space.

Usage:
    python cleanup.py --old 7      # Delete clipboards older than 7 days
    python cleanup.py --empty      # Delete empty clipboards
    python cleanup.py --all        # Run all cleanup tasks
"""

import argparse
import sys
from datetime import datetime

from app import database
from app.database import cleanup_empty_clipboards, cleanup_old_clipboards


def main():
    parser = argparse.ArgumentParser(
        description="Cleanup old and unused clipboards from the database"
    )
    parser.add_argument(
        "--old",
        type=int,
        metavar="DAYS",
        help="Delete clipboards not accessed in specified days (default: 7)",
        default=None,
    )
    parser.add_argument(
        "--empty",
        action="store_true",
        help="Delete clipboards with no cards",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Run all cleanup tasks (old + empty)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be deleted without actually deleting",
    )

    args = parser.parse_args()

    # If no arguments provided, show help
    if not args.old and not args.empty and not args.all:
        parser.print_help()
        sys.exit(0)

    # Initialize database
    database.init_db()
    db = database.SessionLocal()

    try:
        total_deleted = 0

        print("=" * 60)
        print("Shared Clipboard - Cleanup Script")
        print("=" * 60)
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()

        if args.dry_run:
            print("DRY RUN MODE - No actual deletions will occur")
            print()

        # Cleanup old clipboards
        if args.old or args.all:
            days = args.old if args.old else 7
            print(f"Cleaning up clipboards not accessed in {days} days...")

            if args.dry_run:
                from datetime import timedelta

                cutoff_date = datetime.utcnow() - timedelta(days=days)
                old_clipboards = (
                    db.query(database.Clipboard)
                    .filter(database.Clipboard.last_accessed < cutoff_date)
                    .all()
                )
                count = len(old_clipboards)
                print(f"  Would delete {count} old clipboard(s)")
                for clipboard in old_clipboards[:5]:  # Show first 5
                    print(
                        f"    - {clipboard.id} (last accessed: {clipboard.last_accessed})"
                    )
                if count > 5:
                    print(f"    ... and {count - 5} more")
            else:
                count = cleanup_old_clipboards(db, days)
                print(f"  Deleted {count} old clipboard(s)")
                total_deleted += count

            print()

        # Cleanup empty clipboards
        if args.empty or args.all:
            print("Cleaning up empty clipboards (no cards)...")

            if args.dry_run:
                empty_clipboards = (
                    db.query(database.Clipboard)
                    .filter(~database.Clipboard.cards.any())
                    .all()
                )
                count = len(empty_clipboards)
                print(f"  Would delete {count} empty clipboard(s)")
                for clipboard in empty_clipboards[:5]:  # Show first 5
                    print(f"    - {clipboard.id} (created: {clipboard.created_at})")
                if count > 5:
                    print(f"    ... and {count - 5} more")
            else:
                count = cleanup_empty_clipboards(db)
                print(f"  Deleted {count} empty clipboard(s)")
                total_deleted += count

            print()

        # Summary
        print("=" * 60)
        if args.dry_run:
            print("DRY RUN COMPLETE - No changes made")
        else:
            print(f"CLEANUP COMPLETE - Total deleted: {total_deleted} clipboard(s)")
        print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)

    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
