import { isEmpty, uniq } from 'lodash';
import React from 'react';
import { Select } from '../../../components';
import { useComponentWillUnmount } from '../../hooks';

function TagNameSelect({
  onChange, defaultTagName = [], options, tagNameCustom = [], setCustomTag = () => {}, ...props
}) {
  const [tagList, setTagList] = React.useState(options);
  const [tag, setTag] = React.useState(defaultTagName);
  const [inputVal, setInputVal] = React.useState('');
  const isFirstSet = React.useRef(false);

  const handleSelectTag = (value) => {
    setTag(value);
    onChange(value);
  };
  React.useEffect(() => {
    // custom platform created
    if (!isEmpty(tagNameCustom) && !isFirstSet.current) {
      setTagList(uniq([...tagNameCustom, ...tagList]));
      isFirstSet.current = true;
    }
  }, [tagNameCustom]);

  useComponentWillUnmount(() => { isFirstSet.current = false; setTagList([]); });

  const handleCreateTag = (e) => {
    const value = inputVal;
    const nameTagList = tagList.map((d) => d.id.toLowerCase());
    if (['Enter'].includes(e.code) && !isEmpty(value) && !nameTagList.includes(value.toLowerCase()) && /^[-_A-Za-z]+$/.test(value) && !/^[-_]+$/.test(value[0])) {
      e.stopPropagation();
      e.preventDefault();
      const updateTagList = [...tagList];
      const newOption = { id: value.trim().toLowerCase(), name: value.trim() };
      updateTagList.unshift(newOption);
      setTagList([...updateTagList]);
      setCustomTag([...updateTagList]);
      // const selectedTag = tag;
      // selectedTag.unshift(value.trim());
      // setTag(selectedTag);
    }
  };
  React.useEffect(() => () => {
    setTag([]);
  }, []);

  return (
    <Select
      value={tag}
      options={!isEmpty(tagList) ? tagList : []}
      onChange={handleSelectTag}
      onInputChange={(value) => {
        if (/^[-_A-Za-z]+$/.test(value) && !/^[-_]+$/.test(value[0])) {
          setInputVal(value);
        }
        if (!value) {
          setInputVal(value);
        }
        // tagCreateValue.current = value;
      }}
      inputValue={inputVal}
      onKeyDown={(e) => { handleCreateTag(e); }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

export default TagNameSelect;
