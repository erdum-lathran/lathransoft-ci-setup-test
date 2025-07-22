import React, { useEffect, useMemo } from 'react';
import { DocumentWrapper } from '../../components';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { AppRoutes } from '../../static';
import { useDebounce } from '../../hooks';
import NetworkRequests from '../../netwroking/NetworkRequests';
import Fuse from 'fuse.js';

export default function DocumentListing() {
  // Dispatcher
  const dispatch = useDispatch();

  // Navigation Items
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent_folder_id');

  // Reducer States
  const { reload } = useSelector(state => state.general);

  // Constants
  const debouncedSearch = useDebounce(searchParams.get('search_query'), 1000);
  const isHomePage = location.pathname === AppRoutes.Home;

  const params = useMemo(
    () => ({
      dateType: searchParams.get('date_type'),
      type: searchParams.get('type'),
      sortBy: searchParams.get('sort_by'),
      orderBy: searchParams.get('order_by'),
      parentId,
      search: debouncedSearch, // Use debounced search query
      toDate: searchParams.get('to_date'),
      fromDate: searchParams.get('from_date'),
      isFavorite: location.pathname === AppRoutes.Favourites ? 1 : 0,
      isShared: location.pathname === AppRoutes.Shared ? 1 : 0,
      isDeleted: location.pathname === AppRoutes.Deleted ? 1 : 0,
      isArchived: location.pathname === AppRoutes.Archived ? 1 : 0,
      isPaginated: 1,
      page: 1,
      limit: 18,
    }),
    [debouncedSearch, searchParams, location.pathname]
  );
  console.log("Query Params:", params);

  const getParamsList = () => {
    let finalParams = {};
    if (isHomePage) {
      finalParams = {
        sortBy: 'updatedAt',
        orderBy: 'DESC',
        limit: 12,
        isPaginated: 1,
        page: 1,
      };
    } else {
      finalParams = {
        ...params,
        sortBy: searchParams.get('sort_by') || 'updatedAt',
        orderBy: searchParams.get('order_by') || 'DESC',
      };
    delete finalParams.search;
    }
    return finalParams;
  };
   const stableQueryKey = useMemo(
     () => [
       'documentsList',
       getParamsList(),
       location.pathname,
       reload,
       debouncedSearch,
     ],
     [getParamsList, location.pathname, reload, debouncedSearch]
    );
  const {
    data,
    isFetchingNextPage,
    refetch,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
   queryKey: stableQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return NetworkRequests.getDocumentsList(location, {
        ...getParamsList(),
        page: pageParam,
      });
    },
    getNextPageParam: lastPage => {
      const currentPageData = lastPage?.documents;

      if (currentPageData?.length > 0 && lastPage?.hasMore && !isHomePage) {
        return lastPage.currentPage + 1;
      }

      return undefined; // No more pages
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 Minutes
    retry: 1,
  });

  const documents = data?.pages?.flatMap(page => page.documents) || []; // Flatten the documents from each page

  const filteredDocuments = useMemo(() => {
  if (location.pathname === AppRoutes.Deleted) return documents;
  let docsToFilter = documents;
    if (parentId) {
    docsToFilter = docsToFilter.filter(doc => `${doc.parentId}` === `${parentId}`);
  } else {
    docsToFilter = docsToFilter.filter(doc => doc.parentId === 0);
  }
  docsToFilter = docsToFilter.filter(
    doc => typeof doc.name === 'string' && doc.name.trim() !== '');
  if (debouncedSearch?.trim()) {
    const normalized = docsToFilter.map(doc => ({
      ...doc,
      __orig: doc,
      name: doc.name.toLowerCase(),
    }));
    const fuse = new Fuse(normalized, {
      keys: ['name'],
      threshold: 0.6,
      includeScore: true,
    });
    const results = fuse.search(debouncedSearch.toLowerCase());
    return results.map(r => r.item.__orig);
  }
  return docsToFilter;
}, [documents, parentId, location.pathname, debouncedSearch]);

  useEffect(() => {
    refetch();
  }, [reload, searchParams]);

  console.log("Location Path:", location.pathname);
  console.log("Search Params:", Object.fromEntries(searchParams.entries()));
  useEffect(() => {
    if (data) {
      console.log("Fetched Data Pages:", data.pages);
      console.log("Flattened Documents:", documents);
    }
  }, [data]);
  useEffect(() => {
    console.log("Parent ID:", parentId);
    console.log("Filtered Documents:", filteredDocuments);
  }, [filteredDocuments, parentId]);
  const showLoading = documents.length === 0 && (isFetchingNextPage || isPending);

  return (
    <DocumentWrapper
      isLoading={showLoading}
      data={filteredDocuments}
      fetchMoreData={fetchNextPage}
      hasMore={hasNextPage}
    />
  );
}
