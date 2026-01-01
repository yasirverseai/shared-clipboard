from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, database, schemas

# Initialize database
database.init_db()

# Create FastAPI app
app = FastAPI(
    title="Shared Clipboard API",
    description="A simple API for sharing textual data via unique URLs",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Shared Clipboard API",
        "endpoints": {
            "POST /clipboard/new": "Create a new clipboard",
            "GET /clipboard/{clipboard_id}": "Get clipboard with all cards",
            "POST /clipboard/{clipboard_id}/cards": "Add a new card",
            "PUT /cards/{card_id}": "Update a card",
            "DELETE /cards/{card_id}": "Delete a card",
            "DELETE /clipboard/{clipboard_id}": "Delete entire clipboard",
            "POST /admin/cleanup/old": "Cleanup old clipboards (7+ days)",
            "POST /admin/cleanup/empty": "Cleanup empty clipboards",
        },
    }


@app.post(
    "/clipboard/new",
    response_model=schemas.ClipboardIDResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_clipboard(db: Session = Depends(database.get_db)):
    """
    Create a new clipboard with a unique ID.
    Returns the unique ID that can be used in the URL.
    """
    clipboard = crud.create_clipboard(db)
    return schemas.ClipboardIDResponse(id=clipboard.id)


@app.get("/clipboard/{clipboard_id}", response_model=schemas.ClipboardResponse)
def get_clipboard(clipboard_id: str, db: Session = Depends(database.get_db)):
    """
    Get the clipboard by its ID with all cards.
    If the clipboard doesn't exist, returns 404.
    """
    clipboard = crud.get_clipboard(db, clipboard_id)

    if not clipboard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Clipboard with id '{clipboard_id}' not found",
        )

    return clipboard


@app.post(
    "/clipboard/{clipboard_id}/cards",
    response_model=schemas.CardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_card(
    clipboard_id: str,
    card_data: schemas.CardCreate,
    db: Session = Depends(database.get_db),
):
    """
    Create a new card in the clipboard.
    """
    card = crud.create_card(db, clipboard_id, card_data.content, card_data.user_name)

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Clipboard with id '{clipboard_id}' not found",
        )

    return card


@app.put("/cards/{card_id}", response_model=schemas.CardResponse)
def update_card(
    card_id: int,
    card_data: schemas.CardUpdate,
    db: Session = Depends(database.get_db),
):
    """
    Update a card's content.
    """
    card = crud.update_card(db, card_id, card_data.content)

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id '{card_id}' not found",
        )

    return card


@app.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, db: Session = Depends(database.get_db)):
    """
    Delete a card.
    """
    success = crud.delete_card(db, card_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id '{card_id}' not found",
        )

    return None


@app.delete("/clipboard/{clipboard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clipboard(clipboard_id: str, db: Session = Depends(database.get_db)):
    """
    Delete an entire clipboard and all its cards.
    """
    clipboard = crud.get_clipboard(db, clipboard_id)

    if not clipboard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Clipboard with id '{clipboard_id}' not found",
        )

    db.delete(clipboard)
    db.commit()

    return None


@app.post("/admin/cleanup/old")
def cleanup_old_clipboards(days: int = 7, db: Session = Depends(database.get_db)):
    """
    Delete clipboards that haven't been accessed in the specified number of days.
    Default is 7 days.
    """
    count = database.cleanup_old_clipboards(db, days)
    return {
        "message": f"Cleaned up {count} old clipboard(s)",
        "days": days,
        "deleted": count,
    }


@app.post("/admin/cleanup/empty")
def cleanup_empty_clipboards(db: Session = Depends(database.get_db)):
    """
    Delete clipboards that have no cards.
    """
    count = database.cleanup_empty_clipboards(db)
    return {
        "message": f"Cleaned up {count} empty clipboard(s)",
        "deleted": count,
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
