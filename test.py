import requests

"""
subreddit:
r/femboys
r/GothGirls

"""

def parse(subreddit, after=''):
    urltemplate = 'https://www.reddit.com/r/%7B%7D/top.json?t=all{}'
 
    headers = {
        'User-Agent': 'Virboxbot'
    }
 
    params = f'&after={after}' if after else ''
 
    url = urltemplate.format(subreddit, params)
    response = requests.get(url, headers=headers)
    print(response)
    data = response.json()['data']
    for post in data['children']:
        pdata = post['data']
        img = pdata['url']
        print(img)

        return data['after']
    else:
        print(f'Error {response.statuscode}')
        return None


def main():
    subreddit = 'femboys'
    with open('after.txt', 'r') as f:
        after = f.read()
    print(after)

    try:
        while True:
            after = parse(subreddit, after)
            if not after:
                break
    except KeyboardInterrupt:
        with open('after.txt', 'w') as f:
            f.write(after)

        print('Exiting...')
 
if __name__ == '__main__':
    main()