import { describe, it, expect } from 'vitest';
import {
  extractKeywords,
  calculateATSScore,
  termsMatch,
  getScoreColor,
  getScoreLabel,
} from './atsAnalyzer';

describe('ATS Analyzer', () => {
  describe('extractKeywords', () => {
    it('extracts technical skills from text', () => {
      const text = 'Experience with React, Node.js, and Python development';
      const keywords = extractKeywords(text);

      expect(keywords.technical.has('react')).toBe(true);
      expect(keywords.technical.has('node.js')).toBe(true);
      expect(keywords.technical.has('python')).toBe(true);
    });

    it('handles empty or invalid input', () => {
      expect(extractKeywords('')).toEqual({
        technical: new Set(),
        general: new Set(),
        phrases: new Set(),
      });
      expect(extractKeywords(null)).toEqual({
        technical: new Set(),
        general: new Set(),
        phrases: new Set(),
      });
    });

    it('extracts general keywords excluding stop words', () => {
      const text = 'Developing scalable applications with performance optimization';
      const keywords = extractKeywords(text);

      expect(keywords.general.has('developing')).toBe(true);
      expect(keywords.general.has('scalable')).toBe(true);
      expect(keywords.general.has('with')).toBe(false); // stop word
    });
  });

  describe('termsMatch', () => {
    it('matches identical terms', () => {
      expect(termsMatch('react', 'react')).toBe(true);
      expect(termsMatch('React', 'REACT')).toBe(true);
    });

    it('matches synonyms', () => {
      expect(termsMatch('react', 'reactjs')).toBe(true);
      expect(termsMatch('rest api', 'restful api')).toBe(true);
      expect(termsMatch('aws', 'amazon web services')).toBe(true);
    });

    it('does not match unrelated terms', () => {
      expect(termsMatch('react', 'angular')).toBe(false);
      expect(termsMatch('python', 'javascript')).toBe(false);
    });
  });

  describe('calculateATSScore', () => {
    it('calculates score based on keyword matches', () => {
      const jobKeywords = {
        technical: new Set(['react', 'node.js', 'python']),
        general: new Set(['development', 'scalable']),
        phrases: new Set(['full stack']),
      };
      const resumeKeywords = {
        technical: new Set(['react', 'node.js']),
        general: new Set(['development']),
        phrases: new Set([]),
      };

      const result = calculateATSScore(jobKeywords, resumeKeywords);

      expect(result.score).toBeGreaterThan(0);
      expect(result.matched.technical).toContain('react');
      expect(result.matched.technical).toContain('node.js');
      expect(result.missing.technical).toContain('python');
    });

    it('returns 0 for empty keywords', () => {
      const emptyKeywords = {
        technical: new Set(),
        general: new Set(),
        phrases: new Set(),
      };

      const result = calculateATSScore(emptyKeywords, emptyKeywords);
      expect(result.score).toBe(0);
    });
  });

  describe('getScoreColor', () => {
    it('returns green for high scores', () => {
      expect(getScoreColor(80)).toBe('#22c55e');
      expect(getScoreColor(90)).toBe('#22c55e');
    });

    it('returns yellow for medium scores', () => {
      expect(getScoreColor(50)).toBe('#eab308');
      expect(getScoreColor(65)).toBe('#eab308');
    });

    it('returns red for low scores', () => {
      expect(getScoreColor(20)).toBe('#ef4444');
      expect(getScoreColor(10)).toBe('#ef4444');
    });
  });

  describe('getScoreLabel', () => {
    it('returns appropriate labels for score ranges', () => {
      expect(getScoreLabel(85)).toBe('Excellent Match');
      expect(getScoreLabel(75)).toBe('Good Match');
      expect(getScoreLabel(55)).toBe('Fair Match');
      expect(getScoreLabel(35)).toBe('Needs Improvement');
      expect(getScoreLabel(15)).toBe('Low Match');
    });
  });
});
