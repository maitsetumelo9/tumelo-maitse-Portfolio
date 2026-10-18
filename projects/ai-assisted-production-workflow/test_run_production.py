import unittest

from run_production import check_metadata, safe_repo_path


class ProductionRunnerTests(unittest.TestCase):
    def test_expected_video_metadata_passes(self):
        actual = {"width": 720, "height": 1280, "duration_seconds": 12.01}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12}
        self.assertEqual(check_metadata(actual, expected), [])

    def test_wrong_dimensions_fail(self):
        actual = {"width": 1280, "height": 720, "duration_seconds": 12}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12}
        self.assertTrue(any("width" in item for item in check_metadata(actual, expected)))
        self.assertTrue(any("height" in item for item in check_metadata(actual, expected)))

    def test_duration_outside_tolerance_fails(self):
        actual = {"width": 720, "height": 1280, "duration_seconds": 12.3}
        expected = {"width": 720, "height": 1280, "duration_seconds": 12}
        self.assertTrue(any("duration_seconds" in item for item in check_metadata(actual, expected)))

    def test_path_traversal_is_rejected(self):
        with self.assertRaises(ValueError):
            safe_repo_path("../../outside.txt")


if __name__ == "__main__":
    unittest.main()
