//combobox from https://headlessui.com/react/combobox

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import clsx from 'clsx';


function CategorySelect({ categories }) {
  const [selected, setSelected] = useState(categories[0]);
  const [query, setQuery] = useState('');

  const filteredCategories =
  query === ''
  ? categories
  : categories.filter((category) =>
      category && category.name && category.name.includes(query)
    );

  return (
      <div className="mx-auto h-screen w-52 pt-20">
          <Combobox value={selected} onChange={setSelected} onClose={() => setQuery('')}>
              <div className="relative">
                  <ComboboxInput
                      className={clsx(
                          'w-full rounded-lg border-2 bg-gray-500/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                      )}
                      displayValue={(category) => category?.name}
                      onChange={(event) => setQuery(event.target.value)}
                  />
                  <ComboboxButton className="absolute inset-y-0 right-2 flex items-center">
                      <ChevronDownIcon className="w-4 h-4 size-4 fill-white/60 group-data-[hover]:fill-white justify-top" />
                  </ComboboxButton>
              </div>

              <ComboboxOptions
                  anchor="bottom"
                  transition
                  className={clsx(
                      'w-[var(--input-width)] rounded-xl border border-gray-600/5 bg-gray-500/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                      'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                  )}
              >
                  {filteredCategories.map((category) => (
                      <ComboboxOption
                          key={category.id}
                          value={category}
                          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                      >
                          <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                          <div className="text-sm/6 text-black">{category.name}</div>
                      </ComboboxOption>
                  ))}
              </ComboboxOptions>
          </Combobox>
      </div>
  );
}

export default CategorySelect;
