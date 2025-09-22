<template>
  <SearchPageTemplate>
    <template #search-form>
      <SearchForm @search="handleSearch" />
    </template>

    <template #search-results>
      <SearchResults :results="searchResults" />
    </template>
  </SearchPageTemplate>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SearchPageTemplate from '@/components/templates/SearchPageTemplate.vue';
import SearchForm from '@/components/molecules/SearchForm.vue';
import SearchResults from '@/components/organisms/SearchResults.vue';
import { SearchResult } from '@/interfaces/search';

const searchResults = ref<SearchResult[]>([]);

const mockApiData: SearchResult[] = [
  {
    title: '創業小聚／從失敗中學習：新創公司的七個致命錯誤',
    description: '本文深入分析新創公司常見的七個失敗原因，並提供實際案例與建議，幫助創業者避開陷阱。',
    link: 'https://www.bnext.com.tw/article/12345',
    source: '創業小聚',
  },
  {
    title: '政府補助指南：2025年最新中小企業創業貸款懶人包',
    description: '經濟部中小企業處整理的最新創業貸款方案，包含申請資格、文件準備與審核流程，助您輕鬆取得啟動資金。',
    link: 'https://www.sme.gov.tw/guides/67890',
    source: '經濟部中小企業處',
  },
  {
    title: '親子天下／學齡前幼兒的感官探索：5個在家就能做的簡單遊戲',
    description: '專家分享如何透過簡單的日常生活用品，刺激幼兒的五感發展，促進大腦連結與學習能力。',
    link: 'https://www.parenting.com.tw/article/54321',
    source: '親子天下',
  },
  {
    title: 'Harvard Business Review：創新思維與商業模式的關係',
    description: '深度解析頂尖企業如何運用創新思維，重塑商業模式，創造持久競爭力。適合所有想突破瓶頸的創業者。',
    link: 'https://hbr.org/2025/01/innovation-and-business-models',
    source: 'Harvard Business Review',
  },
  {
    title: 'Coursera精選課程：Python數據分析入門',
    description: '從零開始學習Python數據分析的基礎知識與實用技能，為你的創業計畫提供數據支持。',
    link: 'https://www.coursera.org/learn/python-data-analysis',
    source: 'Coursera',
  },
];

const handleSearch = (query: string) => {
  console.log(`Searching for: ${query}`);
  // Simulate an API call with a delay
  setTimeout(() => {
    // Filter mock data based on query for a more realistic demo
    const filteredResults = mockApiData.filter(result =>
      result.title.includes(query) || result.description.includes(query)
    );
    searchResults.value = filteredResults.length > 0 ? filteredResults : [];
  }, 1000);
};
</script>