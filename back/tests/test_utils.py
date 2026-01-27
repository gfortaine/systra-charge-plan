from myapp.utils.version import version


def test_version():
    assert '.' in version
    assert len(version.split('.')) == 3
