import json
import csv
import io
from typing import Dict, Any

class ReportService:
    @staticmethod
    def generate_json_report(case_data: Dict[str, Any]) -> str:
        report = {
            "title": "FindTrace AI Investigation Report",
            "tagline": "Search. Track. Verify.",
            "disclaimer": "MANDATORY LEGAL DISCLAIMER: AI-generated candidate matches are probabilistic and based on visual feature similarity. They require human verification. This system does NOT establish identity or provide definitive identity confirmation.",
            "case_information": {
                "case_id": case_data.get("case_number"),
                "case_name": case_data.get("case_name"),
                "person_name": case_data.get("person_name", "N/A"),
                "age": case_data.get("age", "N/A"),
                "gender": case_data.get("gender", "N/A"),
                "last_known_location": case_data.get("last_known_location", "N/A"),
                "created_at": str(case_data.get("created_at")),
                "status": case_data.get("status")
            },
            "cctv_summary": {
                "videos_analyzed": case_data.get("total_videos", 0),
                "total_frames_analyzed": case_data.get("total_frames", 0),
                "people_detected": case_data.get("people_detected", 0),
                "potential_matches": case_data.get("potential_matches_count", 0)
            },
            "candidate_matches": [
                {
                    "candidate_code": cand.get("candidate_code"),
                    "track_id": cand.get("track_id"),
                    "similarity_score": f"{int(cand.get('similarity_score', 0) * 100)}%",
                    "similarity_band": cand.get("similarity_band"),
                    "first_seen": cand.get("first_seen"),
                    "last_seen": cand.get("last_seen"),
                    "primary_camera": cand.get("primary_camera_id"),
                    "review_status": cand.get("status"),
                    "reviewer_notes": cand.get("reviewer_notes", "None")
                }
                for cand in case_data.get("candidates", [])
            ]
        }
        return json.dumps(report, indent=2)

    @staticmethod
    def generate_csv_report(case_data: Dict[str, Any]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["FindTrace AI Investigation Report - Candidate Matches Summary"])
        writer.writerow(["Case Number", case_data.get("case_number")])
        writer.writerow(["Case Name", case_data.get("case_name")])
        writer.writerow(["Disclaimer", "AI-generated candidate matches are probabilistic and require human verification. The system does not establish identity."])
        writer.writerow([])
        writer.writerow(["Candidate ID", "Track ID", "Similarity Score", "Similarity Band", "First Seen", "Last Seen", "Camera ID", "Review Status", "Notes"])
        
        for cand in case_data.get("candidates", []):
            writer.writerow([
                cand.get("candidate_code"),
                cand.get("track_id"),
                f"{int(cand.get('similarity_score', 0) * 100)}%",
                cand.get("similarity_band"),
                cand.get("first_seen"),
                cand.get("last_seen"),
                cand.get("primary_camera_id"),
                cand.get("status"),
                cand.get("reviewer_notes", "")
            ])
        return output.getvalue()
