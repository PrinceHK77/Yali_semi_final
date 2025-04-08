from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io
import psycopg2

app = Flask(__name__)
CORS(app)
DB_NAME = "persona_db"
DB_USER = "postgres"
DB_PASSWORD = "password"
DB_HOST = "localhost"  # Change if using a remote server
DB_PORT = "5432" 
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()
print("Connected to PostgreSQL successfully!")

@app.route('/import-data', methods=['POST'])
def import_data():
    file_type = request.headers.get('X-File-Type', '').lower()
    
    try:
        if file_type == 'csv':
            # Handle CSV data
            csv_data = request.data.decode('utf-8')
            df = pd.read_csv(io.StringIO(csv_data))
        elif file_type in ['xlsx', 'xls']:
            # Handle Excel data
            excel_data = request.data
            df = pd.read_excel(io.BytesIO(excel_data))
        else:
            return jsonify({"error": "Unsupported file format"}), 400
            
        # Process the DataFrame
        record_count = len(df)
        print(f"Received {record_count} records from {file_type} file")
        
        

        # PostgreSQL connection parameters
 # Default PostgreSQL port

        # Function to clean values (replace NaN with None)
        def clean_value(value):
            return None if pd.isna(value) else value

        # Connect to PostgreSQL
        try:

            # Read Excel file
            # file_path = "user_data.xlsx"  # Ensure this file exists in the script directory
            # df = pd.read_excel(file_path)

            # Insert query
            persona_query = """
            INSERT INTO personas (name, email, phone, state, pin_code, message, type, is_favorite, profile_photo, created_at, updated_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()) RETURNING id
            """

            # Insert into employees table (for Employee type personas)
            employee_query = """
                INSERT INTO employees (persona_id, date_of_birth, father_name, blood_group, emergency_contact, aadhar_number, 
                joining_date, probation_end_date, previous_employer) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            vendor_query = """
                INSERT INTO vendors (persona_id, address, pan_number, gst_number, bank_name, account_number, ifsc_code) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            # Insert into customers table
            customer_query = """
                INSERT INTO customers (persona_id, age, location, job, income_range, family_members, weight, speed, user_type, 
                wheelchair_type, commute_range, commute_mode, pains_daily, pains_commute, solutions_needed, 
                customer_segment, expected_gain) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            # Iterate through each row and insert into personas, then into employees if applicable
            for _, row in df.iterrows():
                cur.execute(persona_query, [
                    row["name"],
                    row["email"],
                    row["phone"],
                    clean_value(row.get("state")),
                    clean_value(row.get("pin_code")),
                    clean_value(row.get("message")),
                    row["type"],
                    bool(row["is_favorite"]),
                    clean_value(row.get("profile_photo", "")),
                ])
                
                persona_id = cur.fetchone()[0]  # Retrieve the inserted persona ID

                # If persona is an Employee, insert into employees table
                if row["type"] == "Employees":
                    cur.execute(employee_query, [
                        persona_id,
                        clean_value(row.get("date_of_birth")),
                        clean_value(row.get("father_name")),
                        clean_value(row.get("blood_group")),
                        clean_value(row.get("emergency_contact")),
                        clean_value(row.get("aadhar_number")),
                        clean_value(row.get("joining_date")),
                        clean_value(row.get("probation_end_date")),
                        clean_value(row.get("previous_employer")),
                    ])
                elif row["type"] == "Vendors":
                    cur.execute(vendor_query, [
                        persona_id,
                        clean_value(row.get("address")),
                        clean_value(row.get("pan_number")),
                        clean_value(row.get("gst_number")),
                        clean_value(row.get("bank_name")),
                        clean_value(row.get("account_number")),
                        clean_value(row.get("ifsc_code")),
                    ])

                # If persona is a Customer, insert into customers table
                elif row["type"] == "Customers":
                    cur.execute(customer_query, [
                        persona_id,
                        clean_value(row.get("age")),
                        clean_value(row.get("location")),
                        clean_value(row.get("job")),
                        clean_value(row.get("income_range")),
                        clean_value(row.get("family_members")),
                        clean_value(row.get("weight")),
                        clean_value(row.get("speed")),
                        clean_value(row.get("user_type")),
                        clean_value(row.get("wheelchair_type")),
                        clean_value(row.get("commute_range")),
                        clean_value(row.get("commute_mode")),
                        clean_value(row.get("pains_daily")),
                        clean_value(row.get("pains_commute")),
                        clean_value(row.get("solutions_needed")),
                        clean_value(row.get("customer_segment")),
                        clean_value(row.get("expected_gain")),
                    ])

            # Commit and close connection
            conn.commit()
                # cur.close()
                # conn.close()
            print("Data inserted successfully!")
        except Exception as e:
            print(f"Error: {e}")
        
        return jsonify({
            "success": True,
            "message": f"Successfully imported {record_count} records",
            "count": record_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500, debug=True)