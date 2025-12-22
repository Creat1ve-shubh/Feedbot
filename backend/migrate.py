#!/usr/bin/env python3
"""
Database migration and setup script.
Creates all tables and indexes from SQLAlchemy models.
Run this once after initial setup or after model changes.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from db.base import engine, Base
from db.models import Post, BrandMetrics, SentimentTimeseries, AnalysisTask

def migrate():
    """Create all tables"""
    print("🔄 Creating database tables...")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    # List created tables
    inspector = __import__('sqlalchemy').inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"\n📊 Database tables ({len(tables)}):")
    for table in tables:
        columns = inspector.get_columns(table)
        print(f"  • {table} ({len(columns)} columns)")
    
    print(f"\n✨ Migration complete!")
    return True


def reset_database():
    """Drop and recreate all tables (WARNING: data loss!)"""
    response = input("⚠️  This will delete ALL data. Type 'yes' to continue: ")
    if response.lower() != "yes":
        print("Cancelled.")
        return False
    
    print("🗑️  Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped")
    
    return migrate()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database migration tool")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Drop and recreate all tables (WARNING: data loss!)"
    )
    
    args = parser.parse_args()
    
    if args.reset:
        success = reset_database()
    else:
        success = migrate()
    
    sys.exit(0 if success else 1)
