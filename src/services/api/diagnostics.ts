import { logger } from '../../utils/logger';

interface DiagnosticResult {
  success: boolean;
  stage: string;
  response?: any;
  error?: string;
  headers?: Record<string, string>;
}

export async function diagnoseApiEndpoint(url: string): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  try {
    // Stage 1: Initial request
    const response = await fetch('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    results.push({
      success: response.ok,
      stage: 'initial_request',
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Stage 2: Content type verification
    const contentType = response.headers.get('content-type');
    const isValidContentType = contentType?.toLowerCase().includes('application/json');
    
    results.push({
      success: Boolean(isValidContentType),
      stage: 'content_type_check',
      headers: { 'content-type': contentType || 'none' }
    });

    if (!isValidContentType) {
      logger.error('Invalid content type', { contentType });
      throw new Error('Invalid content type: ' + contentType);
    }

    // Stage 3: Raw response text
    const rawText = await response.text();
    const hasContent = Boolean(rawText && rawText.trim());
    
    results.push({
      success: hasContent,
      stage: 'raw_response',
      response: hasContent ? rawText.slice(0, 100) : 'Empty response'
    });

    if (!hasContent) {
      logger.error('Empty response received');
      throw new Error('Empty response from server');
    }

    // Stage 4: JSON parsing
    try {
      const jsonData = JSON.parse(rawText);
      results.push({
        success: true,
        stage: 'json_parsing',
        response: {
          success: jsonData.success,
          hasData: Boolean(jsonData.data)
        }
      });
    } catch (error) {
      const parseError = error instanceof Error ? error.message : 'JSON parse failed';
      logger.error('JSON parse error', { error: parseError });
      results.push({
        success: false,
        stage: 'json_parsing',
        error: parseError
      });
      throw new Error('Failed to parse JSON: ' + parseError);
    }

    logger.info('API Diagnostics completed successfully', { results });
    return results;

  } catch (error) {
    logger.error('API Diagnostics failed', { error });
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.push({
      success: false,
      stage: 'diagnostic_error',
      error: errorMessage
    });
    return results;
  }
}