#!/usr/bin/env python
from pathlib import Path

if __name__ != '__main__':
    from ._lookups import *  # noqa: F401,F403

    # START MODELS IMPORT
    from .category import Category  # noqa: F401
    from .charge_plan import ChargePlanLine  # noqa: F401
    from .charge_plan import Person  # noqa: F401
    from .charge_plan import Project  # noqa: F401
    from .comment import Comment  # noqa: F401
    from .line import Line  # noqa: F401
    from .post import Post  # noqa: F401
    from .user import User  # noqa: F401

    # END MODELS IMPORT
    pass
else:
    me = Path(__file__)
    old_content = me.read_text(encoding='utf8')
    new_content = ''
    state = 'pre_models'  # states: pre_models, models, post_models
    for line in old_content.split('\n'):
        if state == 'pre_models':
            if line == '    # START MODELS IMPORT':
                new_content += f"{line}\n"
                state = 'models'
            else:
                new_content += f"{line}\n"
        elif state == 'models':
            if line == '    # END MODELS IMPORT':
                for module_name in [p.stem for p in sorted(me.parent.glob('*.py')) if not p.stem.startswith('_')]:
                    model_name = ''.join(x.title() for x in module_name.split('_'))
                    new_content += f"    from .{module_name} import {model_name}  # noqa: F401\n"
                new_content += f"\n{line}\n"
                state = 'post_models'
        elif state == 'post_models':
            new_content += f"{line}\n"
    me.write_text(new_content.strip() + '\n', encoding='utf8')
