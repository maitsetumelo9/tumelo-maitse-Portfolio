import unittest
from validate_manifest import validate

VALID = {
    "project": "Test", "status": "example",
    "brief": {"deliverables": [{"name": "master", "width": 1920, "height": 1080, "duration_seconds": 15}]},
    "asset_provenance": [{"asset": "original.svg", "source": "original", "usage_terms_reviewed": True}],
    "qa_checklist": {"correct_dimensions": False, "duration_checked": False, "audio_checked": False,
                     "text_and_spelling_checked": False, "safe_areas_checked": False,
                     "rights_reviewed": False, "human_approved": False}
}


class ManifestValidationTests(unittest.TestCase):
    def test_valid_manifest_with_pending_qa_passes_structure(self):
        self.assertEqual(validate(VALID), [])

    def test_missing_project_is_reported(self):
        data = dict(VALID)
        data.pop("project")
        self.assertTrue(any("project" in error for error in validate(data)))

    def test_non_positive_dimensions_are_rejected(self):
        data = {**VALID, "brief": {"deliverables": [{"name": "master", "width": 0, "height": 1080, "duration_seconds": 15}]}}
        self.assertTrue(any("width must be a positive integer" in error for error in validate(data)))

    def test_duplicate_outputs_are_rejected(self):
        item = {"name": "master", "width": 1920, "height": 1080, "duration_seconds": 15}
        data = {**VALID, "brief": {"deliverables": [item, dict(item)]}}
        self.assertTrue(any("Duplicate deliverable name" in error for error in validate(data)))

    def test_unreviewed_asset_is_rejected(self):
        data = {**VALID, "asset_provenance": [{"asset": "clip.mp4", "source": "third-party", "usage_terms_reviewed": False}]}
        self.assertTrue(any("usage terms are not marked reviewed" in error for error in validate(data)))

    def test_bad_qa_type_is_rejected(self):
        data = {**VALID, "qa_checklist": {**VALID["qa_checklist"], "audio_checked": "yes"}}
        self.assertTrue(any("audio_checked" in error for error in validate(data)))


if __name__ == "__main__":
    unittest.main()
