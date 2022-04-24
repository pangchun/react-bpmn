import {
  TextFieldEntry,
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function (element) {
  return [
    {
      id: 'spell',
      element,
      component: Spell,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

function Spell(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.spell || '';
  };

  const setValue = (value) => {
    return modeling.updateProperties(element, {
      spell: value,
    });
  };

  return TextFieldEntry({
    id: id,
    label: translate ? 'Spell' : '魔法值',
    element,
    description: translate ? 'Apply a black magic spell' : '施展一个黑魔法',
    getValue,
    setValue,
    debounce,
  });
  // 下面这种标签的方式会报错
  // <TextFieldEntry
  //   id={ id }
  //   element={ element }
  //   description={ translate('Apply a black magic spell') }
  //   label={ translate('Spell') }
  //   getValue={ getValue }
  //   setValue={ setValue }
  //   debounce={ debounce }
  // />
}
