import './search.css';

import { useEffect, useRef, useState } from 'preact/hooks';
import { useSearchParams } from 'react-router-dom';

import Avatar from '../components/avatar';
import Link from '../components/link';
import Menu from '../components/menu';
import NameText from '../components/name-text';
import Status from '../components/status';
import { api } from '../utils/api';

function Search() {
  const { masto, instance, authenticated } = api();
  const [uiState, setUiState] = useState('default');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFieldRef = useRef();
  const q = searchParams.get('q');
  const [statusResults, setStatusResults] = useState([]);
  const [accountResults, setAccountResults] = useState([]);
  const [hashtagResults, setHashtagResults] = useState([]);
  useEffect(() => {
    if (q) {
      searchFieldRef.current.value = q;

      setUiState('loading');
      (async () => {
        const results = await masto.v2.search({
          q,
          limit: 20,
          resolve: authenticated,
        });
        console.log(results);
        setStatusResults(results.statuses);
        setAccountResults(results.accounts);
        setHashtagResults(results.hashtags);
        setUiState('default');
      })();
    }
  }, [q]);

  return (
    <div id="search-page" class="deck-container">
      <div class="timeline-deck deck">
        <header>
          <div class="header-grid">
            <div class="header-side">
              <Menu />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const { q } = e.target;
                if (q.value) {
                  setSearchParams({ q: q.value });
                }
              }}
            >
              <input
                ref={searchFieldRef}
                name="q"
                type="search"
                autofocus
                placeholder="Search or paste URL"
              />
            </form>
            <div class="header-side" />
          </div>
        </header>
        <main>
          {!!q && uiState !== 'loading' ? (
            <>
              <h2 class="timeline-header">Accounts</h2>
              {accountResults.length > 0 ? (
                <ul class="timeline flat accounts-list">
                  {accountResults.map((account) => (
                    <li>
                      <Avatar url={account.avatar} size="xl" />
                      <NameText
                        account={account}
                        instance={instance}
                        showAcct
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="ui-state">No accounts found.</p>
              )}
              <h2 class="timeline-header">Hashtags</h2>
              {hashtagResults.length > 0 ? (
                <ul>
                  {hashtagResults.map((hashtag) => (
                    <li>
                      <Link
                        to={
                          instance
                            ? `/${instance}/t/${hashtag.name}`
                            : `/t/${hashtag.name}`
                        }
                      >
                        #{hashtag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="ui-state">No hashtags found.</p>
              )}
              <h2 class="timeline-header">Posts</h2>
              {statusResults.length > 0 ? (
                <ul class="timeline">
                  {statusResults.map((status) => (
                    <li>
                      <Link
                        class="status-link"
                        to={
                          instance
                            ? `/${instance}/s/${status.id}`
                            : `/s/${status.id}`
                        }
                      >
                        <Status status={status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="ui-state">No posts found.</p>
              )}
            </>
          ) : (
            <p class="ui-state">Enter your search term above to get started.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Search;
