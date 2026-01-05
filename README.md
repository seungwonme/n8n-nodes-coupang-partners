# Coupang Partners Open API

> 쿠팡 파트너스 오픈 API 문서

## 기본 정보

- **Base URL**: `https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1`
- **인증 방식**: HMAC 서명 (ACCESS_KEY, SECRET_KEY 필요)
- **공식 문서**: https://partners.coupang.com/#help/open-api

---

## 인증 헤더

모든 API 요청에는 다음 헤더가 필요합니다:

```
Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}
```

### 서명 생성 규칙

1. **datetime 형식**: `YYMMDDTHHMMSSZ` (예: `250105T153022Z`)
   - GMT+0 기준 시간 사용
2. **message 구성**: `datetime + method + path + querystring`
   - querystring은 `?` 제외하고 붙임
3. **signature**: message를 SECRET_KEY로 HMAC-SHA256 해싱 후 hex 변환

### JavaScript 예제

```javascript
const crypto = require('crypto');

function generateHmac(method, url, secretKey, accessKey) {
  // URL에서 path와 query 분리
  const [path, query] = url.split('?');

  // datetime 생성 (YYMMDDTHHMMSSZ 형식, GMT 기준)
  const now = new Date();
  const datetime = now.toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
    .slice(2); // 250105T153022Z

  // message 구성: datetime + method + path + querystring
  const message = datetime + method + path + (query || '');

  // HMAC-SHA256 서명 생성
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

// 사용 예시
const accessKey = 'YOUR_ACCESS_KEY';
const secretKey = 'YOUR_SECRET_KEY';
const method = 'GET';
const url = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/1001?limit=20';

const authorization = generateHmac(method, url, secretKey, accessKey);
console.log(authorization);
```

### Python 예제

```python
import hmac
import hashlib
import time
import os

def generate_hmac(method, url, secret_key, access_key):
    # URL에서 path와 query 분리
    parts = url.split("?")
    path = parts[0]
    query = parts[1] if len(parts) > 1 else ""

    # datetime 생성 (YYMMDDTHHMMSSZ 형식, GMT 기준)
    os.environ["TZ"] = "GMT+0"
    datetime = time.strftime('%y%m%d', time.gmtime()) + 'T' + time.strftime('%H%M%S', time.gmtime()) + 'Z'

    # message 구성: datetime + method + path + querystring
    message = datetime + method + path + query

    # HMAC-SHA256 서명 생성
    signature = hmac.new(
        bytes(secret_key, "utf-8"),
        message.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    return f"CEA algorithm=HmacSHA256, access-key={access_key}, signed-date={datetime}, signature={signature}"

# 사용 예시
access_key = 'YOUR_ACCESS_KEY'
secret_key = 'YOUR_SECRET_KEY'
method = 'GET'
url = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/1001?limit=20'

authorization = generate_hmac(method, url, secret_key, access_key)
print(authorization)
```

### 주의사항

- **Rate Limit**: 1시간에 30회 이상 호출 시 24시간 정지, 3회 정지 시 계정 정지
- **키 보안**: ACCESS_KEY, SECRET_KEY는 절대 노출하지 않도록 주의
- **시간 동기화**: 서버 시간이 정확해야 함 (GMT 기준)

---

## Products API

상품 정보를 조회하는 API 그룹입니다.

---

### 1. 카테고리별 베스트 상품 조회

카테고리 별 베스트 상품에 대한 상세 상품 정보를 조회합니다.

**Endpoint**
```
GET /products/bestcategories/{categoryId}
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/1001?limit=20&subId=my-channel&imageSize=512x512" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name         | Type    | Location | Required | Description                          |
| ------------ | ------- | -------- | -------- | ------------------------------------ |
| `categoryId` | integer | path     | Yes      | 카테고리 코드                        |
| `limit`      | integer | query    | No       | 최대 상품 수 (기본값: 20, 최대: 100) |
| `subId`      | string  | query    | No       | 채널 아이디 (미등록 시 정산 제외)    |
| `imageSize`  | string  | query    | No       | 이미지 사이즈 (예: 512x512)          |

**카테고리 코드**

| ID   | 이름          |
| ---- | ------------- |
| 1001 | 여성패션      |
| 1002 | 남성패션      |
| 1010 | 뷰티          |
| 1011 | 출산/유아동   |
| 1012 | 식품          |
| 1013 | 주방용품      |
| 1014 | 생활용품      |
| 1015 | 홈인테리어    |
| 1016 | 가전디지털    |
| 1017 | 스포츠/레저   |
| 1018 | 자동차용품    |
| 1019 | 도서/음반/DVD |
| 1020 | 완구/취미     |
| 1021 | 문구/오피스   |
| 1024 | 헬스/건강식품 |
| 1025 | 국내여행      |
| 1026 | 해외여행      |
| 1029 | 반려동물용품  |
| 1030 | 유아동패션    |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "categoryName": "Coupang PL",
      "isRocket": false,
      "isFreeShipping": false,
      "productId": 27664441,
      "productImage": "http://static.coupangcdn.com/image/...",
      "productName": "탐사 소프트 100% 천연펄프 3겹 롤화장지 30m, 30롤, 1팩",
      "productPrice": 15600,
      "productUrl": "https://link.coupang.com/re/AFFSDP?..."
    }
  ]
}
```

**응답 코드**

| rCode | Description                        |
| ----- | ---------------------------------- |
| 0     | 성공                               |
| 400   | Invalid or Unsupported Category Id |
| 403   | Forbidden                          |
| 429   | Too Many Requests                  |
| 500   | Internal Server Error              |

---

### 2. 골드박스 상품 조회

골드박스 상품에 대한 상세 상품 정보를 조회합니다. (매일 오전 7:30에 업데이트)

**Endpoint**
```
GET /products/goldbox
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox?subId=my-channel&imageSize=512x512" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type   | Location | Required | Description                       |
| ----------- | ------ | -------- | -------- | --------------------------------- |
| `subId`     | string | query    | No       | 채널 아이디 (미등록 시 정산 제외) |
| `imageSize` | string | query    | No       | 이미지 사이즈 (예: 512x512)       |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "categoryName": "Coupang PL",
      "isRocket": false,
      "isFreeShipping": false,
      "productId": 27664441,
      "productImage": "http://static.coupangcdn.com/image/...",
      "productName": "탐사 소프트 100% 천연펄프 3겹 롤화장지 30m, 30롤, 1팩",
      "productPrice": 15600,
      "productUrl": "https://link.coupang.com/re/AFFSDP?..."
    }
  ]
}
```

---

### 3. 쿠팡 PL 상품 조회

쿠팡 PL(Private Label) 상품에 대한 상세 정보를 조회합니다.

**Endpoint**
```
GET /products/coupangPL
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/coupangPL?limit=50&subId=my-channel&imageSize=512x512" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                          |
| ----------- | ------- | -------- | -------- | ------------------------------------ |
| `limit`     | integer | query    | No       | 최대 상품 수 (기본값: 20, 최대: 100) |
| `subId`     | string  | query    | No       | 채널 아이디 (미등록 시 정산 제외)    |
| `imageSize` | string  | query    | No       | 이미지 사이즈 (예: 512x512)          |

---

### 4. 쿠팡 PL 브랜드별 상품 조회

쿠팡 PL 브랜드 별 상품 상세 정보를 조회합니다.

**Endpoint**
```
GET /products/coupangPL/{brandId}
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/coupangPL/1001?limit=50&subId=my-channel&imageSize=512x512" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                          |
| ----------- | ------- | -------- | -------- | ------------------------------------ |
| `brandId`   | integer | path     | Yes      | 브랜드 코드                          |
| `limit`     | integer | query    | No       | 최대 상품 수 (기본값: 20, 최대: 100) |
| `subId`     | string  | query    | No       | 채널 아이디 (미등록 시 정산 제외)    |
| `imageSize` | string  | query    | No       | 이미지 사이즈 (예: 512x512)          |

**브랜드 코드**

| brandId | Brand Name       |
| ------- | ---------------- |
| 1001    | 탐사             |
| 1002    | 코멧             |
| 1003    | Gomgom           |
| 1004    | 줌               |
| 1006    | 곰곰             |
| 1007    | 꼬리별           |
| 1008    | 베이스알파에센셜 |
| 1010    | 비타할로         |
| 1011    | 비지엔젤         |

---

### 5. 상품 검색

검색 키워드에 대한 쿠팡 검색 결과와 상세 상품 정보를 조회합니다.

> **Rate Limit**: 1분당 최대 50번 호출 가능

**Endpoint**
```
GET /products/search
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=노트북&limit=10&subId=my-channel&imageSize=512x512&srpLinkOnly=false" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name          | Type    | Location | Required | Description                                                           |
| ------------- | ------- | -------- | -------- | --------------------------------------------------------------------- |
| `keyword`     | string  | query    | Yes      | 검색 키워드                                                           |
| `limit`       | integer | query    | No       | 최대 상품 수 (기본값: 10, 최대: 10)                                   |
| `subId`       | string  | query    | No       | 채널 아이디 (미등록 시 정산 제외)                                     |
| `imageSize`   | string  | query    | No       | 이미지 사이즈 (예: 512x512)                                           |
| `srpLinkOnly` | boolean | query    | No       | true: 검색결과 페이지 링크만 제공, false(기본값): 상세 상품 정보 포함 |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": {
    "landingUrl": "https://link.coupang.com/re/AFFSRP?...",
    "productData": [
      {
        "keyword": "노트북",
        "rank": 1,
        "isRocket": false,
        "isFreeShipping": false,
        "productId": 27664441,
        "productImage": "https://ads-partners.coupang.com/image1/...",
        "productName": "탐사 소프트 100% 천연펄프 3겹 롤화장지 30m, 30롤, 1팩",
        "productPrice": 15600,
        "productUrl": "https://link.coupang.com/re/AFFSDP?..."
      }
    ]
  }
}
```

---

### 6. 개인화 추천 상품 조회

입력된 ADID 값을 이용해 개인화 추천 상품을 조회합니다.

**Endpoint**
```
GET /products/reco
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/reco?deviceId={ADID}&subId=my-channel&imageSize=512x512" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type   | Location | Required | Description                       |
| ----------- | ------ | -------- | -------- | --------------------------------- |
| `deviceId`  | string | query    | No       | ADID, GAID 또는 IDFA              |
| `subId`     | string | query    | No       | 채널 아이디 (미등록 시 정산 제외) |
| `imageSize` | string | query    | No       | 이미지 사이즈 (예: 512x512)       |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": {
    "isRocket": false,
    "productId": 27664441,
    "productImage": "https://ads-partners.coupang.com/image1/...",
    "productName": "탐사 소프트 100% 천연펄프 3겹 롤화장지 30m, 30롤, 1팩",
    "productPrice": 15600,
    "productUrl": "https://link.coupang.com/re/AFFSDP?..."
  }
}
```

---

## Reports API

쿠팡 파트너스 회원의 실적 정보를 조회하는 API 그룹입니다.

> **Rate Limit**: 1시간당 최대 500번 호출 가능
> **업데이트 주기**: 매일 오후 15:00

---

### 1. 클릭 리포트 조회

일 별 클릭 수에 대한 정보를 조회합니다.

**Endpoint**
```
GET /reports/clicks
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/clicks?startDate=20240101&endDate=20240131&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20181101 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 30일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": "20190307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "addtag": "400",
      "ctag": "Home",
      "click": 888
    }
  ]
}
```

---

### 2. 주문 리포트 조회

일 별 주문 정보를 조회합니다.

**Endpoint**
```
GET /reports/orders
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/orders?startDate=20240101&endDate=20240131&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20181101 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 30일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": "20190307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "addtag": "400",
      "ctag": "Home",
      "orderId": 12345678901234,
      "productId": 1234567,
      "productName": "상품명",
      "quantity": 2,
      "gmv": 8900,
      "commissionRate": 3,
      "commission": 267,
      "categoryName": "패션의류"
    }
  ]
}
```

---

### 3. 취소 리포트 조회

일 별 취소 정보를 조회합니다.

**Endpoint**
```
GET /reports/cancels
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/cancels?startDate=20240101&endDate=20240131&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20181101 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 30일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "orderDate": "20190306",
      "date": "20190307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "addtag": "400",
      "ctag": "Home",
      "orderId": 12345678901234,
      "productId": 1234567,
      "productName": "상품명",
      "quantity": 2,
      "gmv": 8900,
      "commissionRate": 3,
      "commission": 267,
      "categoryName": "패션의류"
    }
  ]
}
```

---

### 4. 수익 리포트 조회

일 별 수익 정보를 조회합니다.

**Endpoint**
```
GET /reports/commission
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/commission?startDate=20240101&endDate=20240131&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20181101 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 30일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": "20190307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "commission": 267,
      "click": 888,
      "order": 888,
      "cancel": 888,
      "gmv": 8900
    }
  ]
}
```

---

## Ads Reports API

카테고리 배너와 다이나믹 배너에 대한 리포트를 조회하는 API 그룹입니다.

> **Rate Limit**: 1시간당 최대 500번 호출 가능
> **업데이트 주기**: 매일 오후 15:00

---

### 1. 광고 노출/클릭 리포트 조회

카테고리 배너와 다이나믹 배너에 대한 광고 요청(request), 응답(response), 노출(impression), 광고 클릭(click) 수치를 조회합니다.

**Endpoint**
```
GET /reports/ads/impression-click
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/ads/impression-click?startDate=20240101&endDate=20240114&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20211025 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 14일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": "20210307",
      "hour": "10",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "pageId": "abc.com",
      "subParam": "abc",
      "widgetId": 12345,
      "widgetType": "STATIC",
      "request": 888,
      "response": 888,
      "impression": 888,
      "click": 888
    }
  ]
}
```

---

### 2. 광고 주문 리포트 조회

카테고리 배너와 다이나믹 배너에 대한 주문 리포트를 조회합니다.

**Endpoint**
```
GET /reports/ads/orders
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/ads/orders?startDate=20240101&endDate=20240114&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20211025 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 14일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": "20210307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "pageId": "abc.com",
      "subParam": "abc",
      "widgetId": 12345,
      "widgetType": "STATIC",
      "orderId": 12345678901234,
      "productId": 1234567,
      "productName": "상품명",
      "quantity": 2,
      "gmv": 8900,
      "commissionRate": 3,
      "commission": 267
    }
  ]
}
```

---

### 3. 광고 취소 리포트 조회

카테고리 배너와 다이나믹 배너에 대한 취소 리포트를 조회합니다.

**Endpoint**
```
GET /reports/ads/cancels
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/ads/cancels?startDate=20240101&endDate=20240114&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20211025 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 14일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "orderDate": "20210307",
      "date": "20210307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "pageId": "abc.com",
      "subParam": "abc",
      "widgetId": 12345,
      "widgetType": "STATIC",
      "orderId": 12345678901234,
      "productId": 1234567,
      "productName": "상품명",
      "quantity": 2,
      "gmv": 8900,
      "commissionRate": 3,
      "commission": 267
    }
  ]
}
```

---

### 4. 광고 eCPM 리포트 조회

카테고리 배너와 다이나믹 배너에 대한 일별 eCPM 값을 조회합니다.

**Endpoint**
```
GET /reports/ads/performance
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/ads/performance?startDate=20240101&endDate=20240114&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20211025 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 14일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": 20210307,
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "pageId": "abc.com",
      "ecpm": 888
    }
  ]
}
```

---

### 5. 광고 수익 리포트 조회

카테고리 배너와 다이나믹 배너에 대한 수익 리포트를 조회합니다.

**Endpoint**
```
GET /reports/ads/commission
```

**curl 예시**
```bash
curl -X GET "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/reports/ads/commission?startDate=20240101&endDate=20240114&subId=my-channel&page=0" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json"
```

**파라미터**

| Name        | Type    | Location | Required | Description                                   |
| ----------- | ------- | -------- | -------- | --------------------------------------------- |
| `startDate` | string  | query    | Yes      | 시작일 (형식: yyyyMMdd, 20211025 이상)        |
| `endDate`   | string  | query    | Yes      | 종료일 (형식: yyyyMMdd, 시작일과 14일 이내)   |
| `subId`     | string  | query    | No       | 채널 아이디                                   |
| `page`      | integer | query    | No       | 페이지 번호 (기본값: 0, 페이지당 최대 1000개) |

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "date": "20210307",
      "trackingCode": "AF1234567",
      "subId": "A1234567890",
      "pageId": "abc.com",
      "subParam": "abc",
      "widgetId": 12345,
      "widgetType": "STATIC",
      "commission": 267
    }
  ]
}
```

---

## Links API

입력된 쿠팡 상품 링크를 파트너스 회원의 링크로 변환하는 API입니다.

---

### Deeplink 생성

쿠팡 URL을 회원 트래킹 코드가 포함된 단축 URL로 변환합니다.

**Endpoint**
```
POST /deeplink
```

**curl 예시**
```bash
curl -X POST "https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink" \
  -H "Authorization: CEA algorithm=HmacSHA256, access-key={ACCESS_KEY}, signed-date={DATETIME}, signature={SIGNATURE}" \
  -H "Content-Type: application/json" \
  -d '{
    "coupangUrls": [
      "https://www.coupang.com/vp/products/184614775"
    ],
    "subId": "my-channel"
  }'
```

**Request Body**

| Name          | Type     | Required | Description          |
| ------------- | -------- | -------- | -------------------- |
| `coupangUrls` | string[] | Yes      | 변환할 쿠팡 URL 배열 |
| `subId`       | string   | No       | 채널 아이디          |

**Request Body 예시**
```json
{
  "coupangUrls": [
    "https://www.coupang.com/vp/products/184614775"
  ],
  "subId": "my-channel"
}
```

**응답 예시**
```json
{
  "rCode": "0",
  "rMessage": "",
  "data": [
    {
      "originalUrl": "https://www.coupang.com/vp/products/184614775",
      "shortenUrl": "https://coupa.ng/blE0dT",
      "landingUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF1234567&pageKey=319834306&itemId=1023216541&vendorItemId=70064597513&traceid=V0-183-5fddb21eaffbb2ef"
    }
  ]
}
```

---

## 공통 응답 코드

| rCode | HTTP Status | Description                         |
| ----- | ----------- | ----------------------------------- |
| 0     | 200         | 성공                                |
| -     | 400         | Bad Request (잘못된 요청)           |
| -     | 403         | Forbidden (권한 없음)               |
| -     | 429         | Too Many Requests (Rate Limit 초과) |
| -     | 500         | Internal Server Error (서버 오류)   |

---

## 응답 데이터 필드 설명

### 상품 정보 (Product)

| Field            | Type    | Description         |
| ---------------- | ------- | ------------------- |
| `productId`      | number  | 상품 ID             |
| `productName`    | string  | 상품명              |
| `productPrice`   | number  | 상품 가격           |
| `productImage`   | string  | 상품 이미지 URL     |
| `productUrl`     | string  | 파트너스 트래킹 URL |
| `categoryName`   | string  | 카테고리명          |
| `isRocket`       | boolean | 로켓배송 여부       |
| `isFreeShipping` | boolean | 무료배송 여부       |

### 주문 정보 (Order)

| Field            | Type   | Description  |
| ---------------- | ------ | ------------ |
| `orderId`        | number | 주문 ID      |
| `productId`      | number | 상품 ID      |
| `productName`    | string | 상품명       |
| `quantity`       | number | 수량         |
| `gmv`            | number | 총 거래액    |
| `commissionRate` | number | 커미션율 (%) |
| `commission`     | number | 커미션 금액  |
| `categoryName`   | string | 카테고리명   |

### 트래킹 정보 (Tracking)

| Field          | Type   | Description          |
| -------------- | ------ | -------------------- |
| `date`         | string | 날짜 (yyyyMMdd)      |
| `trackingCode` | string | 파트너스 트래킹 코드 |
| `subId`        | string | 채널 아이디          |
| `addtag`       | string | 추가 태그            |
| `ctag`         | string | 캠페인 태그          |
| `click`        | number | 클릭 수              |
