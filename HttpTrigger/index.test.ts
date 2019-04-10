/**
 * @jest-environment node
 */

 import * as httpTrigger from './index';

test('Http trigger should receive a imageUrl', async () => {

    const context: any = {
        log: jest.fn()
    };

    const request = {
        query: { name: 'Bill' }
    };

    await httpTrigger.default(context, request);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual('Please pass a image URL to get the thumbnail');
});

test('Http trigger should return thumbnail image', async () => {

    const context: any = {
        log: jest.fn()
    };

    let imageUrl: string = "https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252__340.jpg";
    let imageThumbnail: string = "/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAiADcDASIAAhEBAxEB/8QAGwAAAwEAAwEAAAAAAAAAAAAAAAUGBAECAwf/xAArEAACAQMDAwMCBwAAAAAAAAABAgMABBEFEiETMVEyQWEigRQkQnGhwdH/xAAaAQACAwEBAAAAAAAAAAAAAAAEBQIDBgAB/8QAIBEAAgMBAAICAwAAAAAAAAAAAQIAAxEEEjEhMgUTFP/aAAwDAQACEQMRAD8A+k2sqRAbg2R8inVrqKKAAAT8mom2Fx0+oW7c4JrYs05h6olRFz22/wB1qLOXTMNV+SCruyl1TUcw+rk9gOajNbM8q5ZmKHvhRxTq2nQBWuo1bH6jJj+K2NqNiCFYDYfSDH/tSqT9R+F2L+3s/oGFwJN6Np1u+wJdL1iM7QucfGaoJIGsoSxlY8eynNeJ1a0iUmIRoSeCErBda/KVMZVgpHBx3HmrHre07kr5uxKFwNsRavfF59g3nyAM0V56jFdyOJbddyNzuPGaKMSlQIJZ3OzbHNi8MgXegIB4plMlvMY0lyqrzhTwakLK9Quozj2qjtLqNWDFlbPGPHzXX0lTogtV5zxaPY7a0kKTdNCw7NXF2IrgCOSNX2nK7uB9q6QsuzsBR+JjQhJAEbx8eaX4djAlcw4NmBoLWFmzsDAYYBSwA81z+WdcLsk2/Tkg8V2e9SLerHeme4x2pbqeqw26FfpTxRKI7nIL5og+MmXVFl3jZtA9gBRSm91WJQCJBgnsaKZJWwXMgLKznyAMT6Z6vtT+AnPfxRRVlsj1faOy7jZhm9I9/isLsfo5PoNFFAV+57d6EVXbERNgnv5qf1JmMfLE8+f3oopjXJ8n2ER3DHp9zRRRVsep6n//2Q==";
    const request = {
        query: { imageUrl: imageUrl }
    };

    await httpTrigger.default(context, request);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual(imageThumbnail);
});