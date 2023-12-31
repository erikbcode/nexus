'use client';
import useOutsideClick from '@/hooks/use-outside-click';
import { Subnexus } from '@prisma/client';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState<Subnexus[] | null>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const clientAction = useRef(
    debounce(async (search: string) => {
      // Use a timeout to only run the fetch once the user has
      const res = await fetch(`/api/search?query=${search}`);
      const { data } = await res.json();
      setSearchResults(data);
    }, 300),
  ).current;

  useOutsideClick(commandRef, () => {
    setSearchResults(null);
    setInput('');
  });

  useEffect(() => {
    if (input) {
      clientAction(input);
    }
  }, [input]);

  return (
    <Command ref={commandRef} className="mx-4 relative rounded-lg border max-w-lg overflow-visible">
      <CommandInput
        value={input}
        className="text-sm sm:text-base"
        placeholder="Search communities..."
        onValueChange={(search) => {
          setInput(search);
        }}
      />
      {searchResults && searchResults.length > 0 ? (
        <CommandList className="absolute bg-white dark:bg-zinc-950 top-full w-full shadow rounded-b-lg">
          <CommandGroup heading="Communities">
            {searchResults.map((community) => (
              <CommandItem key={community.id} value={community.name} className="px-0 py-0 my-1">
                <Link href={`/n/${community.name}`} className="w-full px-2 py-2">
                  <span className="font-semibold pr-1">n/</span>
                  {community.name}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      ) : null}

      {searchResults && searchResults.length === 0 && input !== '' && (
        <CommandList className="absolute bg-white dark:bg-zinc-950 top-full w-full shadow rounded-b-lg">
          <div className="text-base p-3 flex justify-center">No Results Found</div>
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
