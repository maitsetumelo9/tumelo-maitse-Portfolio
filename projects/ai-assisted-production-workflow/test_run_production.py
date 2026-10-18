import unittest

from run_production import check_metadata, safe_repo_path


class ProductionRunnerTests(unittest.TestCase):
    def test_expected_video_with_audio_passes(self):
        actual = {"width": 720, "height": 1280, "duration_seconds": 12.01, "has_audio": True, "audio_codec": "aac"}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12, "audio": True}
        self.assertEqual(check_metadata(actual, expected), [])

    def test_missing_audio_fails_when_audio_is_required(self):
        actual = {"width": 720, "height": 1280, "duration_seconds": 12, "has_audio": False}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12, "audio": True}
        self.assertTrue(any("audio" in item for item in check_metadata(actual, expected)))

    def test_wrong_dimensions_fail(self):
        actual = {"width": 1280, "height": 720, "duration_seconds": 12, "has_audio": True, "audio_codec": "aac"}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12, "audio": True}
        self.assertTrue(any("width" in item for item in check_metadata(actual, expected)))
        self.assertTrue(any("height" in item for item in check_metadata(actual, expected)))

    def test_duration_outside_tolerance_fails(self):
        actual = {"width": 720, "height": 1280, "duration_seconds": 12.3, "has_audio": True, "audio_codec": "aac"}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12, "audio": True}
        self.assertTrue(any("duration_seconds" in item for item in check_metadata(actual, expected)))

    def test_path_traversal_is_rejected(self):
        with self.assertRaises(ValueError):
            safe_repo_path("../../outside.txt")


if __name__ == "__main__":
    unittest.main()
