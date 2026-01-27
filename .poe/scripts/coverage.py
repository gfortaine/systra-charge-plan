from pathlib import Path
from typing import TypedDict
from xml.dom import minidom


class CoverageDict(TypedDict):
    lines: int
    covered: int


def _get_coverage(path: Path) -> CoverageDict:
    if not path.exists():
        return CoverageDict(lines=0, covered=0)
    node_list = minidom.parse(str(path)).getElementsByTagName('coverage')
    assert node_list
    node = node_list[0]
    return CoverageDict(lines=int(node.getAttribute('lines-valid')), covered=int(node.getAttribute('lines-covered')))


def total_coverage() -> None:
    reports_dir = Path.cwd().parent / 'reports'  # current dir is .poe
    py_coverage = _get_coverage(reports_dir / 'coverage.xml')
    js_coverage = _get_coverage(reports_dir / 'coverage-js' / 'cobertura-coverage.xml')
    coverage = (py_coverage['covered'] + js_coverage['covered']) / (py_coverage['lines'] + js_coverage['lines'])
    print(f'Total coverage: {coverage * 100:.2f}%')


if __name__ == '__main__':
    total_coverage()
