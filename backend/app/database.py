from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

# SQLite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./clipboard.db"

# Create engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()


# Database Models
class Clipboard(Base):
    __tablename__ = "clipboards"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_accessed = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to cards
    cards = relationship(
        "Card", back_populates="clipboard", cascade="all, delete-orphan"
    )


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clipboard_id = Column(String, ForeignKey("clipboards.id"), nullable=False)
    content = Column(Text, default="")
    user_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to clipboard
    clipboard = relationship("Clipboard", back_populates="cards")


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)


# Cleanup functions
def cleanup_old_clipboards(db, days=7):
    """
    Delete clipboards that haven't been accessed in the specified number of days.
    Returns the number of clipboards deleted.
    """
    from datetime import timedelta

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    old_clipboards = (
        db.query(Clipboard).filter(Clipboard.last_accessed < cutoff_date).all()
    )

    count = len(old_clipboards)

    for clipboard in old_clipboards:
        db.delete(clipboard)

    db.commit()

    return count


def cleanup_empty_clipboards(db):
    """
    Delete clipboards that have no cards.
    Returns the number of clipboards deleted.
    """
    empty_clipboards = db.query(Clipboard).filter(~Clipboard.cards.any()).all()

    count = len(empty_clipboards)

    for clipboard in empty_clipboards:
        db.delete(clipboard)

    db.commit()

    return count
