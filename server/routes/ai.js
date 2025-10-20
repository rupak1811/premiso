const express = require('express');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/ai/analyze
// @desc    Analyze document with AI
// @access  Private
router.post('/analyze', auth, async (req, res) => {
  try {
    const { documentUrl, projectId } = req.body;

    if (!documentUrl) {
      return res.status(400).json({ message: 'Document URL is required' });
    }

    // For now, we'll simulate AI analysis since we need actual document processing
    // In production, you would use OpenAI's vision API or document processing services
    const mockAnalysis = {
      extractedData: {
        projectType: 'Building Construction',
        estimatedCost: 150000,
        estimatedTimeline: 90,
        requiredPermits: ['Building Permit', 'Electrical Permit', 'Plumbing Permit'],
        complianceIssues: ['Missing setback requirements', 'Insufficient parking spaces'],
        recommendations: [
          'Add 2 additional parking spaces to meet city requirements',
          'Adjust building setback by 5 feet from property line',
          'Include fire safety plan in documentation'
        ]
      },
      confidence: 0.85,
      lastAnalyzed: new Date()
    };

    // Update project with AI analysis
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        project.aiAnalysis = mockAnalysis;
        await project.save();
      }
    }

    res.json({
      message: 'Document analyzed successfully',
      analysis: mockAnalysis
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ message: 'AI analysis failed' });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, projectId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get project context if provided
    let projectContext = '';
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        projectContext = `Project: ${project.title}, Type: ${project.type}, Status: ${project.status}`;
      }
    }

    const systemPrompt = `You are an AI assistant for the Permiso Platform, a permit management system. 
    You help users with permit applications, document requirements, and regulatory compliance.
    ${projectContext ? `Current project context: ${projectContext}` : ''}
    
    Provide helpful, accurate information about:
    - Permit requirements and processes
    - Document preparation and submission
    - Regulatory compliance
    - Timeline and cost estimates
    - Common issues and solutions
    
    Be concise, professional, and helpful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    res.json({
      message: 'AI response generated',
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'AI chat failed' });
  }
});

// @route   POST /api/ai/estimate
// @desc    Get cost and timeline estimate
// @access  Private
router.post('/estimate', auth, async (req, res) => {
  try {
    const { projectType, size, complexity, location } = req.body;

    // Mock estimation logic - in production, this would use more sophisticated algorithms
    const baseCosts = {
      'building': 50000,
      'renovation': 25000,
      'commercial': 75000,
      'residential': 30000,
      'other': 20000
    };

    const baseTimelines = {
      'building': 120,
      'renovation': 60,
      'commercial': 150,
      'residential': 90,
      'other': 45
    };

    const complexityMultiplier = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.5,
      'urgent': 2.0
    };

    const sizeMultiplier = Math.max(0.5, Math.min(2.0, size / 1000)); // Assuming size in sq ft

    const baseCost = baseCosts[projectType] || 20000;
    const baseTimeline = baseTimelines[projectType] || 60;
    const complexity = complexityMultiplier[complexity] || 1.0;

    const estimatedCost = Math.round(baseCost * complexity * sizeMultiplier);
    const estimatedTimeline = Math.round(baseTimeline * complexity);

    res.json({
      message: 'Estimate generated successfully',
      estimate: {
        cost: estimatedCost,
        timeline: estimatedTimeline,
        breakdown: {
          baseCost,
          complexityMultiplier: complexity,
          sizeMultiplier: sizeMultiplier,
          projectType,
          location
        }
      }
    });
  } catch (error) {
    console.error('Estimation error:', error);
    res.status(500).json({ message: 'Estimation failed' });
  }
});

// @route   POST /api/ai/validate
// @desc    Validate form data with AI
// @access  Private
router.post('/validate', auth, async (req, res) => {
  try {
    const { formData, projectType } = req.body;

    if (!formData) {
      return res.status(400).json({ message: 'Form data is required' });
    }

    // Mock validation logic
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Check required fields based on project type
    const requiredFields = {
      'building': ['address', 'buildingType', 'totalArea', 'height'],
      'renovation': ['address', 'renovationType', 'affectedArea'],
      'commercial': ['address', 'businessType', 'occupancy', 'totalArea'],
      'residential': ['address', 'dwellingType', 'bedrooms', 'totalArea']
    };

    const fields = requiredFields[projectType] || [];
    fields.forEach(field => {
      if (!formData[field]) {
        validationResults.errors.push(`${field} is required for ${projectType} projects`);
        validationResults.isValid = false;
      }
    });

    // Check for common issues
    if (formData.totalArea && formData.totalArea < 100) {
      validationResults.warnings.push('Total area seems unusually small for this project type');
    }

    if (formData.height && formData.height > 50) {
      validationResults.warnings.push('Building height exceeds standard limits - additional permits may be required');
    }

    res.json({
      message: 'Validation completed',
      validation: validationResults
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ message: 'Validation failed' });
  }
});

module.exports = router;
