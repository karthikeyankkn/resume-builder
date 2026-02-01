import { describe, it, expect } from 'vitest';
import {
  detectWeakPattern,
  getStrengthScore,
  getStrengthLabel,
  generateStatement,
  getAllPowerVerbs,
  suggestImprovements,
  POWER_VERBS,
} from './impactTemplates';

describe('Impact Templates', () => {
  describe('detectWeakPattern', () => {
    it('detects "responsible for" pattern', () => {
      const result = detectWeakPattern('Responsible for managing the team');
      expect(result).not.toBeNull();
      expect(result.patternId).toBe('responsible_for');
    });

    it('detects "worked on" pattern', () => {
      const result = detectWeakPattern('Worked on various projects');
      expect(result).not.toBeNull();
      expect(result.patternId).toBe('worked_on');
    });

    it('detects "managed team" pattern', () => {
      const result = detectWeakPattern('Managed a team of developers');
      expect(result).not.toBeNull();
      expect(result.patternId).toBe('managed_team');
    });

    it('returns null for strong statements', () => {
      const result = detectWeakPattern('Led 8-person team to deliver $1M platform');
      expect(result).toBeNull();
    });

    it('handles empty or short input', () => {
      expect(detectWeakPattern('')).toBeNull();
      expect(detectWeakPattern('test')).toBeNull();
      expect(detectWeakPattern(null)).toBeNull();
    });
  });

  describe('getStrengthScore', () => {
    it('gives high score for quantified achievements', () => {
      const text = 'Led 10-person team to achieve 40% increase in revenue, generating $2M annually';
      const score = getStrengthScore(text);
      expect(score).toBeGreaterThanOrEqual(60);
    });

    it('gives low score for vague statements', () => {
      const text = 'Helped with various things and stuff';
      const score = getStrengthScore(text);
      expect(score).toBeLessThan(20);
    });

    it('rewards power verbs at start', () => {
      const withVerb = 'Led the team to success';
      const without = 'Was leading the team to success';
      expect(getStrengthScore(withVerb)).toBeGreaterThan(getStrengthScore(without));
    });

    it('rewards numbers and metrics', () => {
      const withNumbers = 'Increased sales by 25%';
      const without = 'Increased sales significantly';
      expect(getStrengthScore(withNumbers)).toBeGreaterThan(getStrengthScore(without));
    });

    it('handles empty input', () => {
      expect(getStrengthScore('')).toBe(0);
      expect(getStrengthScore(null)).toBe(0);
    });
  });

  describe('getStrengthLabel', () => {
    it('returns correct labels for score ranges', () => {
      expect(getStrengthLabel(90).label).toBe('Excellent');
      expect(getStrengthLabel(65).label).toBe('Strong');
      expect(getStrengthLabel(45).label).toBe('Fair');
      expect(getStrengthLabel(25).label).toBe('Weak');
      expect(getStrengthLabel(10).label).toBe('Needs Work');
    });

    it('includes color information', () => {
      const label = getStrengthLabel(80);
      expect(label.color).toBeDefined();
      expect(label.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe('generateStatement', () => {
    it('generates statement from template and values', () => {
      const pattern = {
        template: {
          base: 'Led {teamSize} team to {achievement}',
          fields: {
            teamSize: { label: 'Team size', suffix: '-person' },
            achievement: { label: 'Achievement' },
          },
        },
      };
      const values = { teamSize: '8', achievement: 'deliver project' };

      const result = generateStatement(pattern, values);
      expect(result).toBe('Led 8-person team to deliver project');
    });

    it('shows placeholder for missing values', () => {
      const pattern = {
        template: {
          base: 'Led {teamSize} team',
          fields: {
            teamSize: { label: 'Team size' },
          },
        },
      };

      const result = generateStatement(pattern, {});
      expect(result).toContain('[Team size]');
    });
  });

  describe('getAllPowerVerbs', () => {
    it('returns all power verbs as flat array', () => {
      const verbs = getAllPowerVerbs();
      expect(Array.isArray(verbs)).toBe(true);
      expect(verbs.length).toBeGreaterThan(50);
      expect(verbs).toContain('Led');
      expect(verbs).toContain('Built');
      expect(verbs).toContain('Achieved');
    });
  });

  describe('POWER_VERBS', () => {
    it('has all expected categories', () => {
      expect(POWER_VERBS).toHaveProperty('leadership');
      expect(POWER_VERBS).toHaveProperty('achievement');
      expect(POWER_VERBS).toHaveProperty('improvement');
      expect(POWER_VERBS).toHaveProperty('creation');
    });

    it('each category has multiple verbs', () => {
      Object.values(POWER_VERBS).forEach(category => {
        expect(Array.isArray(category)).toBe(true);
        expect(category.length).toBeGreaterThan(5);
      });
    });
  });

  describe('suggestImprovements', () => {
    it('suggests adding numbers for weak statements', () => {
      const result = suggestImprovements('Managed the team');
      expect(result.score).toBeLessThan(50);
      expect(result.suggestions.some(s => s.type === 'metrics')).toBe(true);
    });

    it('identifies when strengthening is possible', () => {
      const result = suggestImprovements('Responsible for managing team');
      expect(result.canStrengthen).toBe(true);
      expect(result.pattern).not.toBeNull();
    });
  });
});
