import random
import string
from typing import List, Optional

from sqlalchemy.orm import Session

from . import database, schemas


def generate_unique_id() -> str:
    """Generate a short unique ID for a clipboard (6 characters alphanumeric)"""
    characters = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    return "".join(random.choices(characters, k=6))


def create_clipboard(db: Session) -> database.Clipboard:
    """Create a new clipboard with a unique ID"""
    clipboard_id = generate_unique_id()

    # Ensure the ID is unique (very unlikely to collide, but safe)
    while get_clipboard(db, clipboard_id):
        clipboard_id = generate_unique_id()

    db_clipboard = database.Clipboard(id=clipboard_id)
    db.add(db_clipboard)
    db.commit()
    db.refresh(db_clipboard)
    return db_clipboard


def get_clipboard(db: Session, clipboard_id: str) -> Optional[database.Clipboard]:
    """Get a clipboard by ID and update last_accessed timestamp"""
    from datetime import datetime

    clipboard = (
        db.query(database.Clipboard)
        .filter(database.Clipboard.id == clipboard_id)
        .first()
    )

    if clipboard:
        clipboard.last_accessed = datetime.utcnow()
        db.commit()
        db.refresh(clipboard)

    return clipboard


def get_or_create_clipboard(
    db: Session, clipboard_id: Optional[str] = None
) -> database.Clipboard:
    """Get an existing clipboard or create a new one"""
    if clipboard_id:
        db_clipboard = get_clipboard(db, clipboard_id)
        if db_clipboard:
            return db_clipboard

    # Create new clipboard if ID not provided or not found
    return create_clipboard(db)


# Card operations
def create_card(
    db: Session, clipboard_id: str, content: str, user_name: Optional[str] = None
) -> Optional[database.Card]:
    """Create a new card in a clipboard"""
    # Verify clipboard exists
    clipboard = get_clipboard(db, clipboard_id)
    if not clipboard:
        return None

    db_card = database.Card(
        clipboard_id=clipboard_id, content=content, user_name=user_name
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


def get_cards(db: Session, clipboard_id: str) -> List[database.Card]:
    """Get all cards for a clipboard"""
    return (
        db.query(database.Card)
        .filter(database.Card.clipboard_id == clipboard_id)
        .order_by(database.Card.created_at.asc())
        .all()
    )


def get_card(db: Session, card_id: int) -> Optional[database.Card]:
    """Get a specific card by ID"""
    return db.query(database.Card).filter(database.Card.id == card_id).first()


def update_card(db: Session, card_id: int, content: str) -> Optional[database.Card]:
    """Update a card's content"""
    db_card = get_card(db, card_id)

    if db_card:
        db_card.content = content
        db.commit()
        db.refresh(db_card)
        return db_card

    return None


def delete_card(db: Session, card_id: int) -> bool:
    """Delete a card"""
    db_card = get_card(db, card_id)

    if db_card:
        db.delete(db_card)
        db.commit()
        return True

    return False
