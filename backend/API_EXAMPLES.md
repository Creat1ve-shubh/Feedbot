# API Usage Examples

## Using PowerShell

### 1. Health Check

```powershell
# Simple check
Invoke-RestMethod http://localhost:8000/health

# Output: @{status=ok}
```

### 2. Queue Analysis Job

```powershell
# Analyze Nike with Reddit only
$body = @{
    brand = "Nike"
    limit = 100
    include_reddit = $true
    include_twitter = $false
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/analyze" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "Task ID: $($response.task_id)"
# Output: Task ID: abc-123-def-456
```

### 3. Get Results

```powershell
# Fetch Nike results
$results = Invoke-RestMethod "http://localhost:8000/results?brand=Nike&limit=50"

# Display summary
Write-Host "Found $($results.Count) posts"
$results | ForEach-Object {
    Write-Host "[$($_.sentiment)] $($_.platform): $($_.text.Substring(0, [Math]::Min(50, $_.text.Length)))..."
}
```

### 4. Full Workflow Example

```powershell
# Step 1: Queue job
$analyzeBody = @{
    brand = "Nike"
    limit = 50
    include_reddit = $true
    include_twitter = $false
} | ConvertTo-Json

Write-Host "🚀 Queueing analysis job for Nike..." -ForegroundColor Cyan
$task = Invoke-RestMethod -Uri "http://localhost:8000/analyze" `
    -Method Post `
    -Body $analyzeBody `
    -ContentType "application/json"

Write-Host "✅ Job queued: $($task.task_id)" -ForegroundColor Green

# Step 2: Wait for processing
Write-Host "⏳ Waiting 30 seconds for processing..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 3: Fetch results
Write-Host "📊 Fetching results..." -ForegroundColor Cyan
$results = Invoke-RestMethod "http://localhost:8000/results?brand=Nike&limit=10"

# Step 4: Analyze sentiment distribution
$sentiments = $results | Group-Object sentiment
Write-Host "`n📈 Sentiment Distribution:" -ForegroundColor Green
$sentiments | ForEach-Object {
    Write-Host "  $($_.Name): $($_.Count) posts"
}

# Step 5: Show top topics
$allTopics = $results.topics | ForEach-Object { $_ } | Group-Object
Write-Host "`n🏷️  Top Topics:" -ForegroundColor Green
$allTopics | Sort-Object Count -Descending | Select-Object -First 5 | ForEach-Object {
    Write-Host "  $($_.Name): $($_.Count) mentions"
}

# Step 6: Show sample posts
Write-Host "`n📝 Sample Posts:" -ForegroundColor Green
$results | Select-Object -First 3 | ForEach-Object {
    Write-Host "`n  Platform: $($_.platform)" -ForegroundColor White
    Write-Host "  Sentiment: $($_.sentiment) ($($_.confidence)%)" -ForegroundColor White
    Write-Host "  Topics: $($_.topics -join ', ')" -ForegroundColor White
    Write-Host "  Text: $($_.text.Substring(0, [Math]::Min(100, $_.text.Length)))..." -ForegroundColor Gray
}
```

## Using cURL (Cross-platform)

### 1. Health Check

```bash
curl http://localhost:8000/health
```

### 2. Queue Analysis Job

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Nike",
    "limit": 100,
    "include_reddit": true,
    "include_twitter": false
  }'
```

### 3. Get Results

```bash
curl "http://localhost:8000/results?brand=Nike&limit=50"
```

## Using Python

### 1. Setup

```python
import requests
import time
from typing import Dict, List

BASE_URL = "http://localhost:8000"
```

### 2. Health Check

```python
def check_health() -> Dict:
    response = requests.get(f"{BASE_URL}/health")
    return response.json()

print(check_health())  # {'status': 'ok'}
```

### 3. Queue Analysis Job

```python
def analyze_brand(brand: str, limit: int = 100, 
                  include_reddit: bool = True, 
                  include_twitter: bool = False) -> Dict:
    payload = {
        "brand": brand,
        "limit": limit,
        "include_reddit": include_reddit,
        "include_twitter": include_twitter
    }
    response = requests.post(f"{BASE_URL}/analyze", json=payload)
    return response.json()

result = analyze_brand("Nike", limit=50)
print(f"Task ID: {result['task_id']}")
```

### 4. Get Results

```python
def get_results(brand: str, limit: int = 100) -> List[Dict]:
    params = {"brand": brand, "limit": limit}
    response = requests.get(f"{BASE_URL}/results", params=params)
    return response.json()

results = get_results("Nike", limit=50)
print(f"Found {len(results)} posts")
```

### 5. Full Analysis Pipeline

```python
import requests
import time
from collections import Counter

def full_analysis(brand: str, limit: int = 50):
    print(f"🚀 Starting analysis for {brand}...")
    
    # Queue job
    task = analyze_brand(brand, limit=limit, include_reddit=True, include_twitter=False)
    print(f"✅ Job queued: {task['task_id']}")
    
    # Wait for processing
    print("⏳ Waiting for processing...")
    time.sleep(30)
    
    # Fetch results
    print("📊 Fetching results...")
    results = get_results(brand, limit=limit)
    
    if not results:
        print("❌ No results found")
        return
    
    # Analyze sentiments
    sentiments = Counter(r['sentiment'] for r in results)
    print(f"\n📈 Sentiment Distribution:")
    for sentiment, count in sentiments.items():
        print(f"  {sentiment}: {count} posts")
    
    # Analyze topics
    all_topics = []
    for r in results:
        if r['topics']:
            all_topics.extend(r['topics'])
    
    topics = Counter(all_topics)
    print(f"\n🏷️  Top Topics:")
    for topic, count in topics.most_common(5):
        print(f"  {topic}: {count} mentions")
    
    # Show sample posts
    print(f"\n📝 Sample Posts:")
    for r in results[:3]:
        print(f"\n  Platform: {r['platform']}")
        print(f"  Sentiment: {r['sentiment']} ({r['confidence']}%)")
        print(f"  Topics: {', '.join(r['topics'])}")
        print(f"  Text: {r['text'][:100]}...")

# Run analysis
full_analysis("Nike", limit=50)
```

## Using JavaScript/Node.js

### 1. Setup

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
```

### 2. Health Check

```javascript
async function checkHealth() {
    const response = await axios.get(`${BASE_URL}/health`);
    return response.data;
}

checkHealth().then(data => console.log(data));
```

### 3. Queue Analysis Job

```javascript
async function analyzeBrand(brand, limit = 100, includeReddit = true, includeTwitter = false) {
    const response = await axios.post(`${BASE_URL}/analyze`, {
        brand,
        limit,
        include_reddit: includeReddit,
        include_twitter: includeTwitter
    });
    return response.data;
}

analyzeBrand('Nike', 50).then(data => {
    console.log(`Task ID: ${data.task_id}`);
});
```

### 4. Get Results

```javascript
async function getResults(brand, limit = 100) {
    const response = await axios.get(`${BASE_URL}/results`, {
        params: { brand, limit }
    });
    return response.data;
}

getResults('Nike', 50).then(results => {
    console.log(`Found ${results.length} posts`);
});
```

### 5. Full Workflow

```javascript
async function fullAnalysis(brand, limit = 50) {
    console.log(`🚀 Starting analysis for ${brand}...`);
    
    // Queue job
    const task = await analyzeBrand(brand, limit, true, false);
    console.log(`✅ Job queued: ${task.task_id}`);
    
    // Wait for processing
    console.log('⏳ Waiting 30 seconds for processing...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Fetch results
    console.log('📊 Fetching results...');
    const results = await getResults(brand, limit);
    
    if (!results.length) {
        console.log('❌ No results found');
        return;
    }
    
    // Analyze sentiments
    const sentiments = results.reduce((acc, r) => {
        acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
        return acc;
    }, {});
    
    console.log('\n📈 Sentiment Distribution:');
    Object.entries(sentiments).forEach(([sentiment, count]) => {
        console.log(`  ${sentiment}: ${count} posts`);
    });
    
    // Analyze topics
    const allTopics = results.flatMap(r => r.topics || []);
    const topics = allTopics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
    }, {});
    
    console.log('\n🏷️  Top Topics:');
    Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([topic, count]) => {
            console.log(`  ${topic}: ${count} mentions`);
        });
    
    // Show sample posts
    console.log('\n📝 Sample Posts:');
    results.slice(0, 3).forEach(r => {
        console.log(`\n  Platform: ${r.platform}`);
        console.log(`  Sentiment: ${r.sentiment} (${r.confidence}%)`);
        console.log(`  Topics: ${r.topics.join(', ')}`);
        console.log(`  Text: ${r.text.substring(0, 100)}...`);
    });
}

// Run analysis
fullAnalysis('Nike', 50);
```

## Response Examples

### Health Check Response

```json
{
  "status": "ok"
}
```

### Analyze Response

```json
{
  "task_id": "abc-123-def-456",
  "status": "queued"
}
```

### Results Response

```json
[
  {
    "id": "a1b2c3d4e5f6...",
    "brand": "Nike",
    "platform": "reddit",
    "text": "Just got my new Nike Air Max 90s and they are incredibly comfortable! The cushioning is amazing.",
    "sentiment": "Positive",
    "confidence": 95,
    "emotion": ["Joy"],
    "topics": ["Comfort", "Quality"],
    "intent": "Praise",
    "summary": "Users praise Nike's comfort and fit.",
    "polarity_score": 950,
    "created_at": "2025-11-08T10:30:00Z"
  },
  {
    "id": "f6e5d4c3b2a1...",
    "brand": "Nike",
    "platform": "reddit",
    "text": "Nike shoes are great but way too expensive. I wish they had more affordable options.",
    "sentiment": "Mixed",
    "confidence": 65,
    "emotion": ["Frustration"],
    "topics": ["Pricing", "Quality"],
    "intent": "Feedback",
    "summary": "Users like Nike but find it expensive.",
    "polarity_score": 0,
    "created_at": "2025-11-08T09:15:00Z"
  }
]
```

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Enable at least one source"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "brand"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Tips

1. **Wait Time**: After queuing a job, wait at least 20-30 seconds before fetching results
2. **Rate Limits**: Reddit/Twitter APIs have rate limits - start with small `limit` values
3. **Credentials**: Add API credentials to `.env` for better scraping results
4. **Error Handling**: Always wrap API calls in try-catch blocks
5. **Pagination**: For large result sets, fetch in batches using the `limit` parameter
