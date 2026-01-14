from supabase import create_client, Client
import streamlit as st

url = st.secrets["https://wskehyuejpkyxcnisrlu.supabase.co"]
key = st.secrets["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza2VoeXVlanBreXhjbmlzcmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTk3ODksImV4cCI6MjA4Mzk3NTc4OX0.IvRh7uWh5BYWuoXvARidqTMhUaQQ3yJ1wlMS1E283ko"]
supabase: Client = create_client(url, key)

st.subheader("Add New Portfolio Project")
with st.form("new_project_form"):
    p_name = st.text_input("Project Name")
    p_desc = st.text_area("Description")
    p_tech = st.text_input("Tech Stack (comma separated)")
    p_git  = st.text_input("GitHub Link")
    p_demo = st.text_input("Live Demo Link")
    
    if st.form_submit_button("Upload to Portfolio"):
        # This pushes the data to the Supabase Cloud
        supabase.table("portfolio_projects").insert({
            "name": p_name, 
            "description": p_desc, 
            "tech_stack": p_tech,
            "github_link": p_git,
            "demo_link": p_demo
        }).execute()
        st.success("Project Live!")
